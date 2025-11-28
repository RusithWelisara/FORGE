import type { SceneNode } from "@gaze/shared";

const NODE_REGEX =
  /\[node name="(?<name>[^"]+)" type="(?<type>[^"]+)"[^\]]*\]([\s\S]*?)(?=\[node|\Z)/g;
const PROPERTY_REGEX = /(?<key>[A-Za-z0-9_]+) = (?<value>.+)/g;

export function parseSceneFile(content: string): SceneNode[] {
  const nodes: SceneNode[] = [];
  for (const match of content.matchAll(NODE_REGEX)) {
    const groups = match.groups ?? {};
    const properties: SceneNode["properties"] = [];
    const body = match[0];
    let propertyMatch: RegExpExecArray | null;
    while ((propertyMatch = PROPERTY_REGEX.exec(body))) {
      const [, key, valueRaw] = propertyMatch;
      properties.push({
        name: key,
        type: inferType(valueRaw),
        value: normalizeValue(valueRaw)
      });
    }

    nodes.push({
      name: groups.name ?? "Node",
      type: groups.type ?? "Node",
      properties
    });
  }
  return nodes;
}

function inferType(raw: string) {
  if (raw === "true" || raw === "false") return "bool";
  if (raw.startsWith("Vector2(")) return "vector2";
  if (raw.startsWith("Color(")) return "color";
  if (raw.includes(".") && !Number.isNaN(Number(raw))) return "float";
  if (!Number.isNaN(Number(raw))) return "int";
  return "string";
}

function normalizeValue(raw: string) {
  if (raw === "true" || raw === "false") {
    return raw === "true";
  }
  const num = Number(raw);
  if (!Number.isNaN(num)) {
    return num;
  }
  return raw.replace(/^"|"$/g, "");
}

