import React, { useState } from 'react';

export function AIPanel({ onGenerate }) {
    const [prompt, setPrompt] = useState("");
    return (
        <div className="bottom-panel">
            <h3>AI Assistant</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. Make player move with arrow keys"
                />
                <button onClick={() => onGenerate(prompt)} style={{ background: '#03dac6', color: '#000' }}>Generate Logic</button>
            </div>
        </div>
    )
}
