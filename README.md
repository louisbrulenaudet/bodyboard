<img src="assets/thumbnail.png" alt="Bodyboard Thumbnail" width="400px" />

# Bodyboard, canonical instructions for code helpers from a single AGENTS.md 🌊
**Bodyboard** generates canonical instructions for code helpers from a single [`AGENTS.md`](./AGENTS.md) file. It streamlines adapter outputs for Gemini CLI, Copilot, Cline and OpenAI Codex integrations.

## Installation

### Prerequisites

- Node.js **v20 or higher** (ESM-only, no CommonJS support)
- npm

### Global Install

```bash
npm install -g bodyboard
```

### Local Install

```bash
npm install bodyboard --save-dev
```

## Usage

### Generate All Adapter Outputs

```bash
bodyboard create all
```

Or, using npm scripts:

```bash
npm run bodyboard create all
```

### Generate Specific Adapter Output

- Gemini: `bodyboard create gemini`
- Copilot: `bodyboard create copilot`
- Cline: `bodyboard create cline`

#### Options

- `--out <dir>`: Output root directory (default: current repo)
- `--dry-run`: Show paths and diffs without writing
- `--verbose`: Detailed logs

#### Example Output Files

- `GEMINI.md`, `.gemini/settings.template.json`
- `.github/copilot-instructions.md`
- `.clinerules/instructions.md`

---

## Adapters & Outputs

- **Gemini**: Generates `GEMINI.md``
- **Copilot**: Generates `.github/copilot-instructions.md`
- **Cline**: Generates `.clinerules/instructions.md`

Adapters are implemented in [`src/adapters/`](./src/adapters/). Each adapter extends `TargetAdapter` and implements `emit()`.

---

## Workflow

1. Edit [`AGENTS.md`](./AGENTS.md) with canonical instructions.
2. Run CLI to generate all formats for code helpers.
3. All writes are atomic; folders are created recursively.

---

## Troubleshooting

- **Node version error**: Ensure Node.js >= 20.
- **Permission denied**: Run with appropriate permissions.
- **Missing files**: Check that `AGENTS.md` exists.
- **Adapter not found**: Verify adapter files in `src/adapters/`.

---

## Development

- `npm run build`: Compile TypeScript
- `npm run lint`: Lint with Biome
- `npm run format`: Format code with Biome
- `npm run check`: Type and lint check

---

## Contributing

Contributions are welcome!
- Open issues or pull requests on [GitHub](https://github.com/louisbrulenaudet/bodyboard).
- See [`AGENTS.md`](./AGENTS.md) for canonical instructions.

---

## License

See [LICENSE](./LICENSE).
