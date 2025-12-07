import React from 'react';

export function PropertiesPanel({ object, onChange }) {
    if (!object) return <div className="right-panel">Select an object to edit properties</div>;

    const handleChange = (field, value) => {
        onChange(object.id, { [field]: value });
    };

    return (
        <div className="right-panel">
            <h3>Properties</h3>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>ID</label>
                <input type="text" value={object.id} disabled />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>X</label>
                <input type="number" value={object.x} onChange={e => handleChange('x', parseFloat(e.target.value))} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Y</label>
                <input type="number" value={object.y} onChange={e => handleChange('y', parseFloat(e.target.value))} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Width</label>
                <input type="number" value={object.width} onChange={e => handleChange('width', parseFloat(e.target.value))} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Height</label>
                <input type="number" value={object.height} onChange={e => handleChange('height', parseFloat(e.target.value))} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Color</label>
                <input type="color" value={object.color || '#ffffff'} onChange={e => handleChange('color', e.target.value)} style={{ height: '30px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={object.isStatic || false} onChange={e => handleChange('isStatic', e.target.checked)} style={{ width: 'auto' }} />
                    Static Physics
                </label>
            </div>
        </div>
    );
}
