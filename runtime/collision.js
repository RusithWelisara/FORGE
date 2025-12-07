export class CollisionSystem {
    check(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    resolve(a, b) {
        // Resolve a against b (assuming b is static or we only resolve a)
        // Simple AABB resolution: push out on shortest axis
        if (b.isStatic && !a.isStatic) {
            const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
            const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
            const width = (a.width + b.width) / 2;
            const height = (a.height + b.height) / 2;
            const crossWidth = width * dy;
            const crossHeight = height * dx;

            if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                if (crossWidth > crossHeight) {
                    if (crossWidth > -crossHeight) {
                        // Bottom collision
                        a.y = b.y + b.height;
                        a.velocityY = 0;
                    } else {
                        // Left collision
                        a.x = b.x - a.width;
                        a.velocityX = 0;
                    }
                } else {
                    if (crossWidth > -crossHeight) {
                        // Right collision
                        a.x = b.x + b.width;
                        a.velocityX = 0;
                    } else {
                        // Top collision
                        a.y = b.y - a.height;
                        a.velocityY = 0;
                        // Grounded?
                        // We could adding a flag here to allow jumping
                    }
                }
            }
        }
    }
}
