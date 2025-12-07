export class Input {
    constructor() {
        this.keys = {};
        this.listeners = {
            down: (e) => this.keys[e.code] = true,
            up: (e) => this.keys[e.code] = false
        };
        this.attach();
    }

    attach() {
        window.addEventListener('keydown', this.listeners.down);
        window.addEventListener('keyup', this.listeners.up);
    }

    detach() {
        window.removeEventListener('keydown', this.listeners.down);
        window.removeEventListener('keyup', this.listeners.up);
        this.keys = {};
    }

    isDown(code) {
        return !!this.keys[code];
    }
}
