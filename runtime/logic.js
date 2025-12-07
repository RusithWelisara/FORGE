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

    handleInputBlock(block, dt) {
        if (this.input.isDown(block.event)) {
            const targets = this.objects.filter(o => o.id === block.target);
            targets.forEach(target => {
                if (block.action === 'Move') {
                    // e.g. "Move", speed: { x: 100, y: 0 } or just speed number + direction implied by key?
                    // Prompt says: Event: ArrowKeys, Action: Move, Speed: <number>
                    // We need to map Arrow keys to direction
                    const speed = block.params.speed || 100;
                    if (block.event === 'ArrowLeft') target.velocityX = -speed;
                    if (block.event === 'ArrowRight') target.velocityX = speed;
                    // If we want detailed control, we might add friction elsewhere, output simply sets velocity
                }
                if (block.action === 'Jump') {
                    // Check if grounded? For MVP, infinite jump or we check collision elsewhere.
                    // Simple impulse
                    const strength = block.params.strength || 300;
                    // Only jump if velocityY is near 0 (simple ground check)
                    if (Math.abs(target.velocityY) < 1) {
                        target.velocityY = -strength;
                    }
                }
            });
        } else {
            // Stop movement if key released?
            // "Move" action usually implies continuous hold.
            // If ArrowLeft/Right not held, we might want to dampen X velocity
            // But logic block usually triggers ON event.
            // For MVP: we might need a friction system in engine default update.
        }
    }

    handleTimerBlock(block, dt) {
        // block.params.interval
        // block.state.accumulator
        if (!block.state) block.state = { accumulator: 0 };
        block.state.accumulator += dt;
        if (block.state.accumulator >= block.params.interval) {
            block.state.accumulator = 0;
            // Action
            if (block.action === 'SpawnObject') {
                // Mock spawn
                // We need access to engine to add object... 
                // Currently `objects` is a reference to the array? `this.objects`
                // If we push, it works.
                // We need a template or params for the spawn.
            }
        }
    }

    handleCollision(a, b) {
        if (!this.scene.logic) return;
        this.scene.logic.filter(l => l.type === 'collision').forEach(block => {
            // "With": <object-id> -> assumes 'a' is the target or 'b' is the target
            // One of them must match block.target (the owner of logic?)
            // Or prompt says: Event: OnCollision, With: <object-id> (target)

            // If block.target (the "owner") is colliding with block.params.with (the other)
            let owner = null;
            let other = null;

            if (a.id === block.target && b.id === block.params.with) {
                owner = a; other = b;
            } else if (b.id === block.target && a.id === block.params.with) {
                owner = b; other = a;
            }

            if (owner) {
                if (block.action === 'Destroy') {
                    // removing from array is tricky during iteration in Engine
                    owner._shouldDestroy = true;
                }
                if (block.action === 'Bounce') {
                    owner.velocityY = -300; // Mock bounce
                }
            }
        });
    }
}
