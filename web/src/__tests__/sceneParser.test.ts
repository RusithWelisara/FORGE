import { describe, expect, it } from "vitest";
import { parseSceneFile } from "../lib/sceneParser";

describe("parseSceneFile", () => {
  it("extracts nodes and properties", () => {
    const content = `
[node name="Player" type="CharacterBody2D"]
speed = 120.5
is_active = true
color = Color(1, 0, 0)
`;

    const nodes = parseSceneFile(content);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe("Player");
    expect(nodes[0].properties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "speed", value: 120.5 }),
        expect.objectContaining({ name: "is_active", value: true })
      ])
    );
  });
});

