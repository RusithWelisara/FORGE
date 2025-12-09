*MVP CATEGORY 1 — Core Editor*

 [x] Canvas rendering

 [x] Pan/zoom

 [x] Select objects
    > Note: Implemented selection interaction in EditorCanvas. Updates global state.

 [x] Move objects

 [x] Resize objects
    > Note: Added resize handles (TL, TR, BL, BR) and vizualization helpers.

 [x] Delete objects

 [x] Undo/redo
    > Note: Implemented history stack (ctrl+z/y) and UI buttons.

*MVP CATEGORY 2 — Object System*

 [x] Create objects

 [x] Edit basic properties (x, y, w, h, color)

 [x] Collider on/off
    > Note: Added 'Ghost Mode' (isTrigger) checkbox.

 [x] Static vs dynamic physics

*MVP CATEGORY 3 — Engine Runtime*

 [x] Update loop

 [x] Simple physics (gravity, velocity, collisions)

 [x] Keyboard input

 [x] Basic rendering loop

 [x] Play mode toggle

*MVP CATEGORY 4 — AI Logic Generator*

 [x] User can type instructions

 [x] AI returns behavior code
    > Note: Currently using regex-based mock (ai-mock.js). Added ChangeColor support.

 [x] Behavior attaches to selected object

 [x] Behavior executes in play mode

 [x] Error handling
    > Note: Basic alert if AI fails to generate logic.

*MVP CATEGORY 5 — Visual Logic (Simplified)*

 [x] Event triggers (onUpdate, onKeyPress)
    > Note: Keyboard and Collision events implemented.

 [x] Actions (move, jump, destroy, change color)
    > Note: Move, Jump, Bounce, Destroy, Change Color implemented.

 [x] Block-based or node-based editor (bare minimum)
    > Note: Logic list implemented in Properties Panel with Delete button.

*MVP CATEGORY 6 — Project Export*

 [x] Export project structure

 [x] Export runnable HTML5 bundle

 [x] Export logic + assets

*MVP CATEGORY 7 — Project Management*

 [x] Save project locally

 [x] Load project

 [x] Autosave