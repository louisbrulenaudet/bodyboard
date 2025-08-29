# bodyboard

## Overview

**bodyboard** generates canonical instructions for code helpers from a single [`AGENTS.md`](./AGENTS.md) file, streamlining adapter outputs for Gemini, Copilot, and Cline integrations.

## Quick Start

```bash
npm install -g bodyboard
bodyboard create all
```

Or, using npm scripts:

```bash
npm run bodyboard create all
```

## CLI Commands

- `bodyboard create all` — Generate all adapter outputs
- `bodyboard create gemini` — Generate `GEMINI.md` and `.gemini/settings.template.json`
- `bodyboard create copilot` — Generate `.github/copilot-instructions.md`
- `bodyboard create cline` — Generate `.clinerules/instructions.md`

### Options

- `--out <dir>` — Output root directory (default: current repo)
- `--dry-run` — Show paths and diffs without writing
- `--verbose` — Detailed logs

## Workflow

1. Edit [`AGENTS.md`](./AGENTS.md) with canonical instructions.
2. Run CLI to generate all formats for code helpers.
3. All writes are atomic and folders are created recursively.

## Development

- `npm run build` — Compile TypeScript
- `npm run lint` — Lint with Biome
- `npm run format` — Format code with Biome
- `npm run check` — Type and lint check

## Supported Node.js Versions

- Node.js >= 20 required
- ESM-only (no CommonJS support)

## Documentation

- [AGENTS.md](./AGENTS.md): Canonical agent instructions
- [prompts/README.md](./prompts/README.md): Prompt file documentation

## Contributing

Contributions are welcome! Please open issues or pull requests on [GitHub](https://github.com/louisbrulenaudet/bodyboard).
