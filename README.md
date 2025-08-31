<p align="center">
  <img src="assets/thumbnail.png" alt="Bodyboard Thumbnail" height="150" />
</p>

# Bodyboard, canonical instructions for code helpers from a single AGENTS.md

[![Biome](https://img.shields.io/badge/lint-biome-blue?logo=biome)](https://biomejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![CI](https://github.com/louisbrulenaudet/bodyboard/actions/workflows/ci.yaml/badge.svg)](https://github.com/louisbrulenaudet/bodyboard/actions/workflows/ci.yaml)

Maintaining consistency across diverse code assistant configuration files presents challenges, especially when updates are required for multiple tools and collaboration involves several contributors. **Bodyboard** addresses this by generating canonical instructions for code helpers from a single `AGENTS.md` file, thereby streamlining the production of adapter outputs for Gemini CLI, Copilot, Cline, and OpenAI Codex integrations.

```bash
npm install -g bodyboard
```

Generate adapter outputs for all supported formats.

```bash
bodyboard create all
```

Or, generate a specific adapter output. For example for Gemini CLI:

```bash
bodyboard create gemini
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

## Workflow

1. Edit [`AGENTS.md`](./AGENTS.md) with canonical instructions.
2. Run CLI to generate all formats for code helpers.
3. All writes are atomic; folders are created recursively.

## Feedback
If you have any feedback, please reach out at [louisbrulenaudet@icloud.com](mailto:louisbrulenaudet@icloud.com).
