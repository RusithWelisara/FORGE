import { Router } from "express";
import { z } from "zod";
import {
  projectService
} from "../services/projectService";
import { queuePreviewBuild } from "../controllers/previewController";

const router = Router();

router.get("/tree", async (_req, res) => {
  const tree = await projectService.getProjectTree();
  res.json(tree);
});

router.get("/file", async (req, res) => {
  const schema = z.object({
    path: z.string()
  });
  const { path } = schema.parse(req.query);
  const content = await projectService.readFileContent(path);
  res.json({
    content,
    language: inferLanguage(path)
  });
});

router.put("/file", async (req, res) => {
  const schema = z.object({
    path: z.string(),
    content: z.string()
  });
  const { path, content } = schema.parse(req.body);
  await projectService.saveFileContent(path, content);
  res.json({ success: true });
});

router.post("/build", async (req, res) => {
  const schema = z.object({
    scenePath: z.string()
  });
  const { scenePath } = schema.parse(req.body);
  const build = await queuePreviewBuild(scenePath);
  res.json(build);
});

function inferLanguage(filePath: string) {
  if (filePath.endsWith(".gd")) return "gdscript";
  if (filePath.endsWith(".tscn")) return "text";
  return "text";
}

export const projectsRouter = router;

