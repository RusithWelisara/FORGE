export function generateLogic(prompt, selectedId) {
    const promptLower = prompt.toLowerCase();
    const target = selectedId || 'player';
    // Fallback to strict 'player' if no selection, user will learn to name/select.

    if (promptLower.includes("arrow keys") || promptLower.includes("move")) {
        return [
            { type: 'input', event: 'ArrowLeft', target: target, action: 'Move', params: { speed: 200 } },
            { type: 'input', event: 'ArrowRight', target: target, action: 'Move', params: { speed: 200 } }
        ];
    }

    if (promptLower.includes("jump") && promptLower.includes("space")) {
        return [
            { type: 'input', event: 'Space', target: target, action: 'Jump', params: { strength: 400 } }
        ];
    }

    if (promptLower.includes("bounce")) {
        return [
            { type: 'collision', event: 'OnCollision', target: target, params: { with: 'floor' }, action: 'Bounce' }
        ];
    }

    return [];
}
