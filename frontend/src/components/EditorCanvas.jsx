import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Engine } from '../../../runtime/engine.js';

export function EditorCanvas({ projectData, isPlaying, onRef, onObjectUpdate, selectedId, onSelect }) {
    const containerRef = useRef(null);
    const engineRef = useRef(null);
    const gizmoRef = useRef(null);
    const interactionRef = useRef({
        isDragging: false,
        dragId: null,
        dragOffset: { x: 0, y: 0 },
        isPanning: false,
        panStart: { x: 0, y: 0 },
        startCameraPos: { x: 0, y: 0 },
        isResizing: false,
        resizeHandle: null,
        startObj: null
    });
    const propsRef = useRef({ selectedId, onSelect, onObjectUpdate });

    useEffect(() => {
        propsRef.current = { selectedId, onSelect, onObjectUpdate };
        // Trigger gizmo update
        if (engineRef.current && engineRef.current.updateGizmos) {
            engineRef.current.updateGizmos();
        }
    }, [selectedId, onSelect, onObjectUpdate]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Init engine
        const engine = new Engine(containerRef.current, projectData, PIXI);
        engine.init().then(() => {
            // Initial render
            engine.renderer.render(projectData.scenes[0].objects);
        });

        engineRef.current = engine;
        if (onRef) onRef(engine);

        // --- Interaction Handlers ---
        const container = containerRef.current;

        // Gizmo Helper
        const updateGizmos = () => {
            if (!engine || !engine.renderer.app) return;
            // Get latest selectedId from propsRef if available, or assume the engine knows?
            // Since we are inside the closure, we rely on propsRef
            const { selectedId } = propsRef.current;

            let g = gizmoRef.current;
            if (!g) {
                g = new PIXI.Graphics();
                g.zIndex = 9999;
                engine.renderer.app.stage.addChild(g);
                gizmoRef.current = g;
            }
            g.clear();

            if (engine.isRunning || !selectedId) return;

            const obj = engine.objects.find(o => o.id === selectedId);
            if (!obj) return;

            // Draw Selection Border
            g.lineStyle(2, 0xffffff, 1);
            g.drawRect(obj.x, obj.y, obj.width, obj.height);

            // Draw Handles
            const handleSize = 8;
            g.beginFill(0x03dac6);
            // TL
            g.drawRect(obj.x - handleSize / 2, obj.y - handleSize / 2, handleSize, handleSize);
            // TR
            g.drawRect(obj.x + obj.width - handleSize / 2, obj.y - handleSize / 2, handleSize, handleSize);
            // BL
            g.drawRect(obj.x - handleSize / 2, obj.y + obj.height - handleSize / 2, handleSize, handleSize);
            // BR
            g.drawRect(obj.x + obj.width - handleSize / 2, obj.y + obj.height - handleSize / 2, handleSize, handleSize);
            g.endFill();

            engine.renderer.render(engine.objects); // Re-render to show gizmos
        };

        // Expose to engine for outside calls
        engine.updateGizmos = updateGizmos;

        const getLocalPos = (e) => {
            const rect = container.getBoundingClientRect();
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const screenToWorld = (x, y) => {
            if (!engine.renderer.app?.stage) return { x, y };
            const stage = engine.renderer.app.stage;
            return {
                x: (x - stage.x) / stage.scale.x,
                y: (y - stage.y) / stage.scale.y
            };
        };

        const onWheel = (e) => {
            if (engine.isRunning) return; // Disable editor zoom in runtime
            e.preventDefault();

            const stage = engine.renderer.app?.stage;
            if (!stage) return;

            const local = getLocalPos(e);

            // Current world pos under mouse
            const worldBefore = screenToWorld(local.x, local.y);

            const zoomFactor = 1.1;
            const direction = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;

            let newScale = stage.scale.x * direction;
            // Limit zoom
            newScale = Math.max(0.1, Math.min(newScale, 5));

            stage.scale.set(newScale);

            // Calculate new screen position to keep world point under mouse
            // screen = world * newScale + newPos
            // newPos = screen - world * newScale
            stage.x = local.x - worldBefore.x * newScale;
            stage.y = local.y - worldBefore.y * newScale;

            engine.renderer.render(engine.objects);
        };

        const onContextMenu = (e) => {
            e.preventDefault();
        };

        const onMouseDown = (e) => {
            if (engine.isRunning) return;
            const local = getLocalPos(e);
            const world = screenToWorld(local.x, local.y);

            // Right/Middle Click -> Pan
            if (e.button === 2 || e.button === 1) {
                interactionRef.current.isPanning = true;
                interactionRef.current.panStart = { x: local.x, y: local.y };
                const stage = engine.renderer.app.stage;
                interactionRef.current.startCameraPos = { x: stage.x, y: stage.y };
                return;
            }

            if (e.button === 0) {
                const { selectedId, onSelect } = propsRef.current;

                // Check Handles
                if (selectedId) {
                    const obj = engine.objects.find(o => o.id === selectedId);
                    if (obj) {
                        const handleSize = 10 / (engine.renderer.app.stage.scale.x || 1);
                        // We use a bit of margin for hitting handles
                        const handles = {
                            TL: { x: obj.x, y: obj.y },
                            TR: { x: obj.x + obj.width, y: obj.y },
                            BL: { x: obj.x, y: obj.y + obj.height },
                            BR: { x: obj.x + obj.width, y: obj.y + obj.height }
                        };

                        // Check distance to handles
                        for (const [key, pos] of Object.entries(handles)) {
                            if (Math.abs(world.x - pos.x) < handleSize && Math.abs(world.y - pos.y) < handleSize) {
                                interactionRef.current.isResizing = true;
                                interactionRef.current.resizeHandle = key;
                                interactionRef.current.startObj = { ...obj };
                                return;
                            }
                        }
                    }
                }

                const objects = engine.objects;
                let found = null;
                for (let i = objects.length - 1; i >= 0; i--) {
                    const obj = objects[i];
                    if (
                        world.x >= obj.x &&
                        world.x <= obj.x + obj.width &&
                        world.y >= obj.y &&
                        world.y <= obj.y + obj.height
                    ) {
                        found = obj;
                        break;
                    }
                }

                if (found) {
                    interactionRef.current.isDragging = true;
                    interactionRef.current.dragId = found.id;
                    interactionRef.current.dragOffset = {
                        x: world.x - found.x,
                        y: world.y - found.y
                    };
                    if (onSelect) onSelect(found.id);
                    // Update gizmos immediately
                    if (engine.updateGizmos) setTimeout(engine.updateGizmos, 0);
                } else {
                    interactionRef.current.isPanning = true;
                    interactionRef.current.panStart = { x: local.x, y: local.y };
                    const stage = engine.renderer.app.stage;
                    interactionRef.current.startCameraPos = { x: stage.x, y: stage.y };
                    if (onSelect) onSelect(null);
                    if (engine.updateGizmos) setTimeout(engine.updateGizmos, 0);
                }
            }
        };

        const onMouseMove = (e) => {
            if (engine.isRunning) return;

            if (interactionRef.current.isDragging) {
                const local = getLocalPos(e);
                const world = screenToWorld(local.x, local.y);
                const { dragId, dragOffset } = interactionRef.current;

                // Update object locally in engine
                const obj = engine.objects.find(o => o.id === dragId);
                if (obj) {
                    obj.x = world.x - dragOffset.x;
                    obj.y = world.y - dragOffset.y;
                    engine.updateGizmos();
                }
            } else if (interactionRef.current.isResizing) {
                const local = getLocalPos(e);
                const world = screenToWorld(local.x, local.y);
                const { resizeHandle, startObj } = interactionRef.current;
                const obj = engine.objects.find(o => o.id === startObj.id);

                if (obj) {
                    let newX = obj.x;
                    let newY = obj.y;
                    let newW = obj.width;
                    let newH = obj.height;

                    // Helper: Drag vector
                    const dx = world.x - (startObj.x + (resizeHandle.includes('R') ? startObj.width : 0));
                    const dy = world.y - (startObj.y + (resizeHandle.includes('B') ? startObj.height : 0));

                    // Logic slightly simplified: we calculate based on handle position vs start
                    // Actually simplest is: Delta from MouseDown? No, World Pos is absolute.

                    if (resizeHandle === 'BR') {
                        newW = Math.max(10, world.x - startObj.x);
                        newH = Math.max(10, world.y - startObj.y);
                    } else if (resizeHandle === 'TR') {
                        newW = Math.max(10, world.x - startObj.x);
                        const bottom = startObj.y + startObj.height;
                        newY = Math.min(bottom - 10, world.y);
                        newH = bottom - newY;
                    } else if (resizeHandle === 'BL') {
                        const right = startObj.x + startObj.width;
                        newX = Math.min(right - 10, world.x);
                        newW = right - newX;
                        newH = Math.max(10, world.y - startObj.y);
                    } else if (resizeHandle === 'TL') {
                        const right = startObj.x + startObj.width;
                        const bottom = startObj.y + startObj.height;
                        newX = Math.min(right - 10, world.x);
                        newY = Math.min(bottom - 10, world.y);
                        newW = right - newX;
                        newH = bottom - newY;
                    }

                    obj.x = newX;
                    obj.y = newY;
                    obj.width = newW;
                    obj.height = newH;
                    engine.updateGizmos();
                }
            } else if (interactionRef.current.isPanning) {
                const local = getLocalPos(e);
                const { panStart, startCameraPos } = interactionRef.current;
                const dx = local.x - panStart.x;
                const dy = local.y - panStart.y;

                const stage = engine.renderer.app.stage;
                stage.x = startCameraPos.x + dx;
                stage.y = startCameraPos.y + dy;

                engine.renderer.render(engine.objects);
            }
        };

        const onMouseUp = () => {
            if (engine.isRunning) return;

            if (interactionRef.current.isDragging) {
                const { dragId } = interactionRef.current;
                const obj = engine.objects.find(o => o.id === dragId);
                if (obj && onObjectUpdate) {
                    const { onObjectUpdate } = propsRef.current;
                    onObjectUpdate(dragId, { x: obj.x, y: obj.y });
                }
            } else if (interactionRef.current.isResizing) {
                const { startObj } = interactionRef.current;
                const obj = engine.objects.find(o => o.id === startObj.id);
                if (obj) {
                    const { onObjectUpdate } = propsRef.current;
                    onObjectUpdate(obj.id, { x: obj.x, y: obj.y, width: obj.width, height: obj.height });
                }
            }
            interactionRef.current.isDragging = false;
            interactionRef.current.isResizing = false;
            interactionRef.current.dragId = null;
            interactionRef.current.resizeHandle = null;
            interactionRef.current.isPanning = false;
        };

        container.addEventListener('contextmenu', onContextMenu);
        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            engine.destroy();
            container.removeEventListener('contextmenu', onContextMenu);
            container.removeEventListener('wheel', onWheel);
            container.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateProjectData(projectData);
            if (!isPlaying) {
                // Force render update in Editor Mode
                engineRef.current.renderer.render(projectData.scenes[0].objects);
                if (engineRef.current.updateGizmos) engineRef.current.updateGizmos();
            }
        }
    }, [projectData]);

    useEffect(() => {
        if (engineRef.current) {
            if (isPlaying) {
                // Reset Camera when playing? Usually games start at 0,0 or have camera logic.
                // For now, let's reset to ensure game looks right.
                const stage = engineRef.current.renderer.app?.stage;
                if (stage) {
                    stage.position.set(0, 0);
                    stage.scale.set(1, 1);
                }
                engineRef.current.start();
            }
            else {
                engineRef.current.stop();
                engineRef.current.updateProjectData(projectData);
            }
        }
    }, [isPlaying]);

    return <div ref={containerRef} className="main-area" style={{ overflow: 'hidden' }}>
        {!isPlaying && <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', opacity: 0.5, pointerEvents: 'none' }}>
            Editor Mode (Scroll to Zoom, Drag to Move/Pan)
        </div>}
        {isPlaying && <div style={{ position: 'absolute', top: 10, left: 10, color: '#03dac6', pointerEvents: 'none' }}>Runtime Active</div>}
    </div>;
}
