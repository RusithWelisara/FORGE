import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { ObjectList } from './components/ObjectList';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EditorCanvas } from './components/EditorCanvas';
import { AIPanel } from './components/AIPanel';
import { generateLogic } from './ai-mock';

import './index.css';

// Raw imports for export handling
import engineRaw from '../../runtime/engine.js?raw';
import rendererRaw from '../../runtime/renderer.js?raw';
import inputRaw from '../../runtime/input.js?raw';
import collisionRaw from '../../runtime/collision.js?raw';
import logicRaw from '../../runtime/logic.js?raw';

const INITIAL_PROJECT = {
  name: "My Game",
  scenes: [
    {
      objects: [
        { id: 'player', x: 100, y: 100, width: 50, height: 50, color: '#03dac6', velocityX: 0, velocityY: 0, isStatic: false },
        { id: 'floor', x: 0, y: 550, width: 800, height: 50, color: '#333333', velocityX: 0, velocityY: 0, isStatic: true }
      ],
      logic: []
    }
  ]
};

function App({ exportFn }) {
  const [projectData, setProjectData] = useState(() => {
    const saved = localStorage.getItem('forge-project');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT;
  });

  const [selectedId, setSelectedId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backupData, setBackupData] = useState(null);

  useEffect(() => {
    localStorage.setItem('forge-project', JSON.stringify(projectData));
  }, [projectData]);

  const handleAddObject = () => {
    const newObj = {
      id: 'obj-' + uuidv4().slice(0, 4),
      x: 400, y: 300, width: 50, height: 50,
      color: '#bb86fc',
      velocityX: 0, velocityY: 0, isStatic: false
    };
    const newScenes = [...projectData.scenes];
    newScenes[0].objects.push(newObj);
    setProjectData({ ...projectData, scenes: newScenes });
    setSelectedId(newObj.id);
  };

  const handleDeleteObject = (id) => {
    // confirm is annoying in dev, skipping for MVP speed or use simple confirm
    if (!window.confirm('Delete object?')) return;
    const newScenes = [...projectData.scenes];
    newScenes[0].objects = newScenes[0].objects.filter(o => o.id !== id);
    setProjectData({ ...projectData, scenes: newScenes });
    if (selectedId === id) setSelectedId(null);
  };

  const handleUpdateObject = (id, changes) => {
    const newScenes = [...projectData.scenes];
    const objIndex = newScenes[0].objects.findIndex(o => o.id === id);
    if (objIndex === -1) return;

    newScenes[0].objects[objIndex] = { ...newScenes[0].objects[objIndex], ...changes };
    setProjectData({ ...projectData, scenes: newScenes });
  };

  const handleGenerateLogic = (prompt) => {
    const newLogic = generateLogic(prompt, selectedId);
    if (newLogic.length === 0) {
      alert("AI didn't understand. Try 'Make player move with arrow keys' or 'jump with space'.");
      return;
    }

    const newScenes = [...projectData.scenes];
    newScenes[0].logic = [...newScenes[0].logic, ...newLogic];
    setProjectData({ ...projectData, scenes: newScenes });
    alert(`Added ${newLogic.length} logic blocks!`);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (backupData) setProjectData(backupData);
      setIsPlaying(false);
    } else {
      setBackupData(JSON.parse(JSON.stringify(projectData)));
      setIsPlaying(true);
    }
  };

  return (
    <div className="layout">
      <div className="header">
        <h2 style={{ margin: 0 }}>FORGE Engine</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button onClick={togglePlay} style={{ background: isPlaying ? '#cf6679' : '#03dac6', color: '#000', fontWeight: 'bold' }}>
            {isPlaying ? 'STOP' : 'PLAY'}
          </button>
          <button onClick={() => exportFn(projectData)}>Export Project</button>
        </div>
      </div>

      <ObjectList
        objects={projectData.scenes[0].objects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAdd={handleAddObject}
        onDelete={handleDeleteObject}
      />

      <EditorCanvas
        projectData={projectData}
        isPlaying={isPlaying}
      />

      <PropertiesPanel
        object={projectData.scenes[0].objects.find(o => o.id === selectedId)}
        onChange={handleUpdateObject}
      />

      <AIPanel onGenerate={handleGenerateLogic} />
    </div>
  );
}

export default function AppWrapper() {
  const handleExport = async (projectData) => {
    const zip = new JSZip();
    zip.file("project.json", JSON.stringify(projectData, null, 2));
    zip.file("scene.json", JSON.stringify(projectData.scenes[0], null, 2));

    const rt = zip.folder("runtime");
    rt.file("engine.js", engineRaw);
    rt.file("renderer.js", rendererRaw);
    rt.file("input.js", inputRaw);
    rt.file("collision.js", collisionRaw);
    rt.file("logic.js", logicRaw);

    const indexHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>${projectData.name}</title>
    <style>body { margin: 0; background: #000; overflow: hidden; display:flex; justify-content:center; align-items:center; height:100vh; }</style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.0.0/pixi.min.js"></script>
</head>
<body>
    <div id="game-container"></div>
    <script type="module">
        import { Engine } from './runtime/engine.js';
        
        async function start() {
            const resp = await fetch('./project.json');
            const projectData = await resp.json();
            const container = document.getElementById('game-container');
            
            // Start Engine
            const engine = new Engine(container, projectData, window.PIXI);
            await engine.init();
            engine.start();
        }
        start();
    </script>
</body>
</html>`;
    zip.file("index.html", indexHtml);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "forge-export.zip");
  };

  return <App exportFn={handleExport} />;
}
