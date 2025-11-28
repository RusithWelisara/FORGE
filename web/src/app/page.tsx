import { ProjectTree } from "../components/ProjectTree";
import { Toolbar } from "../components/Toolbar";
import { StatusBar } from "../components/StatusBar";
import { GDScriptEditor } from "../components/GDScriptEditor";
import { InspectorPanel } from "../components/InspectorPanel";
import { ScenePreview } from "../components/ScenePreview";
import { ConsolePane } from "../components/ConsolePane";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar />
      <div className="flex flex-1">
        <ProjectTree />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1">
            <GDScriptEditor />
            <div className="flex w-96 flex-col border-l border-neutral-900 bg-neutral-950">
              <ScenePreview />
              <InspectorPanel />
            </div>
          </div>
          <ConsolePane />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

