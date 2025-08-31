# Bodyboard Agents Instructions

## Project Overview

Bodyboard provides a unified system for generating canonical instructions for coding assistants from a single `AGENTS.md` file. It streamlines the creation of adapter outputs for multiple code helpers, including Gemini CLI, Copilot, Cline, Claude, Rules, Windsurf, and OpenAI Codex. By maintaining all instructions in one place, Bodyboard ensures consistency and simplifies updates across integrations.

**Supported adapters:** Gemini, Copilot, Cline, Claude, Rules (Zod), Windsurf

## Tech Stack

- **Language:** TypeScript (strict mode, ESNext)
- **Formatting/Linting:** Biome (spaces, double quotes, recommended rules)
- **Build Tools:** Makefile, npm scripts
- **CLI:** Custom Bodyboard CLI for output generation
- **Environment:** Node.js

## Project Structure

```
.
├── src/
│   ├── adapters/
│   │   ├── base.ts         # Base adapter logic
│   │   ├── claude.ts       # Claude adapter
│   │   ├── cline.ts        # Cline adapter
│   │   ├── copilot.ts      # Copilot adapter
│   │   ├── gemini.ts       # Gemini adapter
│   │   ├── rules.ts        # Rules adapter
│   │   └── windsurf.ts     # Windsurf adapter
│   ├── core/
│   │   ├── fs-util.ts      # Filesystem utilities
│   │   ├── generator.ts    # Adapter output generator
│   │   ├── parser.ts       # AGENTS.md parser
│   │   └── types.ts        # Shared types
│   └── cli.ts              # CLI entry point
├── make/
│   ├── dev.mk              # Development Makefile includes
│   ├── help.mk             # Help commands
│   └── variables.mk        # Makefile variables
├── AGENTS.md               # Canonical instructions (this file)
├── README.md               # Usage and overview
├── GEMINI.md               # Example generated output
├── CLAUDE.md               # Example generated output
├── biome.json              # Biome formatting/linting config
├── tsconfig.json           # TypeScript config
├── package.json            # Scripts, dependencies
├── Makefile                # CLI shortcuts for common tasks
└── .github/workflows/ci.yaml # Continuous integration config
```

## Development Workflow

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Edit canonical instructions:**
   Update [`AGENTS.md`](./AGENTS.md) as the single source of truth.
3. **Generate adapter outputs:**
   Use the CLI to generate all or specific adapter outputs:
   ```bash
   bodyboard create all
   bodyboard create gemini
   ```
4. **Format and lint:**
   ```bash
   make format
   make lint
   ```
5. **Test:**
   ```bash
   make test
   ```
6. **Publish/Deploy:**
   Use Makefile or CLI commands as needed.

## Common Commands

| Command                      | Description                                         |
|------------------------------|-----------------------------------------------------|
| `make format`                | Format codebase with Biome                          |
| `make lint`                  | Lint codebase with Biome                            |

## Coding Conventions

- Use **strict TypeScript** throughout the codebase.
- All adapter logic is modular and type-safe.
- Canonical instructions are maintained only in `AGENTS.md`.
- No business logic in adapter or instruction files.
- Formatting enforced by Biome (spaces, double quotes).
- Adapter outputs are generated, not manually edited.

## Best Practices

- Edit only `AGENTS.md` for instruction changes.
- Use CLI for output generation to ensure consistency.
- Always run lint and format before committing.
- Update documentation and examples when instructions change.
- Use Makefile for common tasks.
- Follow semantic versioning for releases.

## Contribution

- Follow all coding conventions and rules.
- Do not add business logic to adapter or instruction files.
- Ensure all changes pass lint, format, and tests.
- Document any changes to canonical instructions.
