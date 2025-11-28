# GAZE Web Godot IDE

Monorepo containing a browser-based IDE for managing Godot projects end to end.

## Packages

- `web/` – Next.js front-end
- `server/` – Node/Express backend providing project APIs
- `packages/shared/` – Shared TypeScript contracts and utilities

## Development

```bash
pnpm install
pnpm dev     # runs all dev servers
```

Individual package commands can be executed with `pnpm --filter <pkg> <command>`.

# GAZE
