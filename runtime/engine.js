import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { CollisionSystem } from './collision.js';
import { LogicInterpreter } from './logic.js';

export class Engine {
    constructor(container, projectData, PIXI) {
        this.projectData = projectData;

        // Ensure objects exist
        this.objects = this.projectData.scenes[0].objects || [];
        this.logic = this.projectData.scenes[0].logic || [];

        this.renderer = new Renderer(container, PIXI);
        this.input = new Input();
        this.collision = new CollisionSystem();
        this.logicInterpreter = new LogicInterpreter(this.projectData.scenes[0], this.input, this.objects);

        this.isRunning = false;
        this.lastTime = 0;
        this.isDestroyed = false;
        this._loop = this._loop.bind(this);
    }

    async init() {
        if (this.isDestroyed) return;
        await this.renderer.init(800, 600);
    }

    start() {
        if (this.isRunning || this.isDestroyed) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._loop);
    }

    stop() {
        this.isRunning = false;
    }

    _loop(timestamp) {
        if (!this.isRunning || this.isDestroyed) return;

        // ... rest of loop check

        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to avoid explosion on lag
        const safeDt = Math.min(dt, 0.1);

        this.update(safeDt);
        this.renderer.render(this.objects);

        requestAnimationFrame(this._loop);
    }

    update(dt) {
        if (this.isDestroyed || !this.renderer.isReady) return;

        // 1. Logic
        this.logicInterpreter.run(dt);

        // 2. Physics / Movement
        this.objects.forEach(obj => {
            if (!obj.isStatic) {
                // Gravity
                obj.velocityY = (obj.velocityY || 0) + 1000 * dt; // Gravity

                // Max Fall Speed
                if (obj.velocityY > 1000) obj.velocityY = 1000;

                // Friction (X axis)
                obj.velocityX = (obj.velocityX || 0) * 0.9;
                if (Math.abs(obj.velocityX) < 1) obj.velocityX = 0;

                obj.x += obj.velocityX * dt;
                obj.y += obj.velocityY * dt;
            }
        });

        // 3. Collision
        // Reset flags or state if needed
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const a = this.objects[i];
                const b = this.objects[j];
                // Check
                if (this.collision.check(a, b)) {
                    // Only resolve physics if NEITHER is a trigger
                    if (!a.isTrigger && !b.isTrigger) {
                        this.collision.resolve(a, b);
                    }
                    this.logicInterpreter.handleCollision(a, b);
                }
            }
        }

        // 4. Cleanup destroyed
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i]._shouldDestroy) {
                this.objects.splice(i, 1);
            }
        }
    }

    updateProjectData(newData) {
        this.projectData = newData;
        this.objects = this.projectData.scenes[0].objects;
        this.logic = this.projectData.scenes[0].logic;

        // Re-bind references
        this.logicInterpreter.scene = this.projectData.scenes[0];
        this.logicInterpreter.objects = this.objects;

        // Force render
        this.renderer.render(this.objects);
    }

    destroy() {
        this.stop();
        this.isDestroyed = true;
        this.renderer.destroy();
        this.input.detach();
    }
}
