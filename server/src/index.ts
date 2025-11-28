import cors from "cors";
import express from "express";
import http from "http";
import { projectsRouter } from "./routes/projects";
import { realtimeHub } from "./realtime";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "*"
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/projects", projectsRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const server = http.createServer(app);
realtimeHub.init(server);

const port = Number(process.env.PORT ?? 4000);
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

