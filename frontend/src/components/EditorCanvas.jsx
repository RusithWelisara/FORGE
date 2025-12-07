import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Engine } from '../../../runtime/engine.js';

export function EditorCanvas({ projectData, isPlaying, onRef }) {
    const containerRef = useRef(null);
    const engineRef = useRef(null);

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

        return () => {
            engine.destroy();
        };
    }, []);

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateProjectData(projectData);
            if (!isPlaying) {
                // Force render update in Editor Mode
                engineRef.current.renderer.render(projectData.scenes[0].objects);
            }
        }
    }, [projectData]);

    useEffect(() => {
        if (engineRef.current) {
            if (isPlaying) engineRef.current.start();
            else {
                engineRef.current.stop();
                // Reset to initial state? 
                // For MVP, we pass the current projectData again to reset positions if we tracked initial vs current.
                // But App state 'projectData' is our source of truth.
                // If runtime modified objects (e.g. physics), 'projectData' in App isn't auto-updated unless we sync back.
                // Ideally: "Play" clones data. "Stop" restores it.
                // We'll handle that in App.jsx.
                engineRef.current.updateProjectData(projectData);
            }
        }
    }, [isPlaying]);

    return <div ref={containerRef} className="main-area">
        {!isPlaying && <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', opacity: 0.5 }}>Editor Mode</div>}
        {isPlaying && <div style={{ position: 'absolute', top: 10, left: 10, color: '#03dac6' }}>Runtime Active</div>}
    </div>;
}
