import React from 'react';

export function PropertiesPanel({ object, logic, onChange, onLogicUpdate }) {
    if (!object) return <div className="right-panel">Select an object to edit properties</div>;

    const handleChange = (field, value) => {
        onChange(object.id, { [field]: value });
    };

    const handleDeleteLogic = (index) => {
        if (!logic || !onLogicUpdate) return;
        const newLogic = [...logic];
        newLogic.splice(index, 1);
        onLogicUpdate(newLogic);
    };

    const objectLogic = logic ? logic.map((l, i) => ({ ...l, globalIndex: i })).filter(l => l.target === object.id) : [];

    return (
        <div className="right-panel">
            <h3>Properties</h3>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>ID</label>
                <input type="text" value={object.id} disabled />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>X</label>
                <input type="number" value={Math.round(object.x)} onChange={e => handleChange('x', parseFloat(e.target.value))} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Y</label>
                <input type="number" value={Math.round(object.y)} onChange={e => handleChange('y', parseFloat(e.target.value))} />
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
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={object.isTrigger || false} onChange={e => handleChange('isTrigger', e.target.checked)} style={{ width: 'auto' }} />
                    Ghost Mode (No Collision)
                </label>
            </div>

            <hr style={{ borderColor: '#333', margin: '20px 0' }} />

            <h3>Logic Blocks</h3>
            {objectLogic.length === 0 && <div style={{ opacity: 0.5, fontSize: '0.9em' }}>No logic attached. Use AI below.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {objectLogic.map((l) => (
                    <div key={l.globalIndex} style={{ background: '#333', padding: '8px', borderRadius: '4px', fontSize: '0.85em' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#bb86fc', fontWeight: 'bold' }}>{l.type.toUpperCase()}</span>
                            <button onClick={() => handleDeleteLogic(l.globalIndex)} style={{ padding: '2px 5px', fontSize: '10px', background: '#cf6679', border: 'none', color: 'black' }}>DEL</button>
                        </div>
                        <div>On: <b>{l.event || 'Tick'}</b></div>
                        <div>Do: <b>{l.action}</b></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
