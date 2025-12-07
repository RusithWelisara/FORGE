
import React from 'react';

export function ObjectList({ objects, selectedId, onSelect, onAdd, onDelete }) {
    return (
        <div className="left-panel">
            <h3>Objects</h3>
            <button onClick={onAdd} style={{ marginBottom: '10px', width: '100%' }}>+ Add Object</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {objects.map(obj => (
                    <li
                        key={obj.id}
                        onClick={() => onSelect(obj.id)}
                        style={{
                            background: selectedId === obj.id ? '#333' : 'transparent',
                            cursor: 'pointer',
                            padding: '8px',
                            borderBottom: '1px solid #333'
                        }}
                    >
                        {obj.id}
                    </li>
                ))}
            </ul>
            {selectedId && <button onClick={() => onDelete(selectedId)} style={{ marginTop: '10px', width: '100%', background: '#6200ee' }}>Delete Selected</button>}
        </div>
    );
}
