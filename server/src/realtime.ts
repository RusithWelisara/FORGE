import type { Server } from "http";
import { WebSocketServer } from "ws";

class RealtimeHub {
  private wss?: WebSocketServer;

  init(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws/build" });
  }

  broadcast(event: string, payload: unknown) {
    if (!this.wss) return;
    const message = JSON.stringify(payload);
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
}

export const realtimeHub = new RealtimeHub();

