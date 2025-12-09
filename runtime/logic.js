export class LogicInterpreter {
    constructor(scene, input, objects) {
        this.scene = scene;
        this.input = input;
        this.objects = objects;
        this.variables = {}; // Store variables here
    }

    run(dt) {
        if (!this.scene.logic) return;

        this.scene.logic.forEach(block => {
            if (block.type === 'input') {
                this.handleInputBlock(block, dt);
            }
            if (block.type === 'timer') {
                this.handleTimerBlock(block, dt);
            }
            // Variables handled in actions usually
        });
    }

    performAction(target, action, params, context = {}) {
        if (!target) return;

        if (action === 'Move') {
            const speed = params.speed || 100;
            // Direction from context or params
            if (context.direction === 'left') target.velocityX = -speed;
            if (context.direction === 'right') target.velocityX = speed;
            if (context.direction === 'none') {
                // Maybe stop?
            }
        }

        if (action === 'Jump') {
            const strength = params.strength || 300;
            if (Math.abs(target.velocityY) < 1) {
                target.velocityY = -strength;
            }
        }

        if (action === 'ChangeColor') {
            target.color = params.color || '#ffffff';
        }

        if (action === 'Destroy') {
            target._shouldDestroy = true;
        }

        if (action === 'Bounce') {
            target.velocityY = -300;
        }

        if (action === 'SpawnObject') {
            // Basic mock spawn: duplicate target or generic
            // For MVP, maybe we skip deep implementation unless requested.
        }
    }

    handleInputBlock(block, dt) {
        if (this.input.isDown(block.event)) {
            const targets = this.objects.filter(o => o.id === block.target);
            targets.forEach(target => {
                let context = {};
                if (block.event === 'ArrowLeft') context.direction = 'left';
                if (block.event === 'ArrowRight') context.direction = 'right';

                this.performAction(target, block.action, block.params, context);
            });
        }
    }

    handleTimerBlock(block, dt) {
        if (!block.state) block.state = { accumulator: 0 };
        block.state.accumulator += dt;
        if (block.state.accumulator >= block.params.interval) {
            block.state.accumulator = 0;

            // Action
            // For now, assume global target usually? Or specific target?
            const targets = this.objects.filter(o => o.id === block.target);
            targets.forEach(target => {
                this.performAction(target, block.action, block.params);
            });
        }
    }

    handleCollision(a, b) {
        if (!this.scene.logic) return;
        this.scene.logic.filter(l => l.type === 'collision').forEach(block => {
            let owner = null;
            let other = null;

            if (a.id === block.target && b.id === block.params.with) {
                owner = a; other = b;
            } else if (b.id === block.target && a.id === block.params.with) {
                owner = b; other = a;
            }

            if (owner) {
                this.performAction(owner, block.action, block.params);
            }
        });
    }
}
