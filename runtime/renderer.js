export class Renderer {
    constructor(container, PIXI) {
        this.PIXI = PIXI;
        this.app = new PIXI.Application();
        this.sprites = new Map(); // id -> sprite
        this.isReady = false;
        this.isDestroyed = false; // Safety flag
        this.container = container;
    }

    async init(width = 800, height = 600) {
        if (this.isDestroyed) return;

        try {
            await this.app.init({ width, height, background: '#111' });
        } catch (e) {
            console.warn("Pixi init failed (likely destroyed):", e);
            return;
        }

        if (this.isDestroyed) {
            // Was destroyed while awaiting init
            if (this.app) this.app.destroy();
            return;
        }

        this.container.appendChild(this.app.canvas);
        this.isReady = true;
    }

    render(objects) {
        if (!this.isReady || this.isDestroyed) return;

        // Verify app stage exists (Pixi v8 safety)
        if (!this.app.stage) return;

        const currentIds = new Set();

        objects.forEach(obj => {
            currentIds.add(obj.id);
            let sprite = this.sprites.get(obj.id);

            if (!sprite) {
                // created
                sprite = new this.PIXI.Graphics();
                this.app.stage.addChild(sprite);
                this.sprites.set(obj.id, sprite);
            }

            // Draw
            sprite.clear();
            sprite.rect(0, 0, obj.width, obj.height);
            sprite.fill(obj.color || 0xFFFFFF);

            sprite.x = obj.x;
            sprite.y = obj.y;
        });

        // Cleanup removed
        for (const [id, sprite] of this.sprites) {
            if (!currentIds.has(id)) {
                if (this.app.stage) this.app.stage.removeChild(sprite);
                sprite.destroy();
                this.sprites.delete(id);
            }
        }
    }

    destroy() {
        this.isDestroyed = true;
        this.isReady = false;

        // If app exists and looks like an app
        if (this.app) {
            try {
                // Check if already destroyed or not initialized? 
                // Pixi v8 app.renderer is null if destroyed or not init?
                // init() creates renderer.
                this.app.destroy(true, { children: true });
            } catch (e) {
                // Ignore destroy errors (already destroyed)
            }
        }
        this.app = null;
    }
}
