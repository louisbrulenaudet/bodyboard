# AGENTS.md

## Overview

This file contains canonical instructions for code helper agents. It serves as the single source of truth for generating agent-specific outputs via adapters.

## Supported Agents

- **Gemini**
  Output: `GEMINI.md`
  Usage: Used for Google Gemini code assistant integrations.

- **Copilot**
  Output: `.github/copilot-instructions.md`
  Usage: Used for GitHub Copilot custom instructions.

- **Cline**
  Output: `.clinerules/instructions.md`
  Usage: Used for Cline agent integrations.

## Writing Agent Instructions

- Write clear, canonical instructions for your code helpers.
- Use Markdown formatting for structure and readability.
- Instructions should be agent-agnostic; adapters will transform them for each target.

## Generation Workflow

1. Edit `AGENTS.md` with your canonical instructions.
2. Run the CLI to generate agent outputs:
   - `bodyboard create all` — Generates all agent outputs.
   - `bodyboard create gemini` — Generates Gemini output.
   - `bodyboard create copilot` — Generates Copilot output.
   - `bodyboard create cline` — Generates Cline output.
3. Outputs are written atomically; directories are created as needed.

## Adapter Details

- Adapters are implemented in `src/adapters/`.
- Each adapter extends the `TargetAdapter` base class and implements an `emit()` method to write agent instructions to the correct location.

## Example Instruction

```markdown
# Coding Guidelines

- Use descriptive variable names.
- Write concise, clear comments.
- Prefer functional programming patterns.
```

## Extending Agents

To add a new agent:
1. Implement a new adapter in `src/adapters/`.
2. Ensure it extends `TargetAdapter` and implements `emit()`.
3. Update CLI logic to support the new agent.

## References

- [README.md](./README.md): Project overview and CLI usage.
- [src/adapters/](./src/adapters/): Adapter implementations.
