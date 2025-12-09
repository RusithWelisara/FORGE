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

    if (promptLower.includes("color")) {
        const color = promptLower.includes("blue") ? '#0000ff' : (promptLower.includes("green") ? '#00ff00' : '#ff0000');
        // Default to trigger on Key 'C' for demo purposes if not specified
        return [
            { type: 'input', event: 'KeyC', target: target, action: 'ChangeColor', params: { color: color } }
        ];
    }

    return [];
}
