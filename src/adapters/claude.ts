// src/adapters/claude.ts

import { join } from "node:path";
import { atomicWriteFile } from "../core/fs-util.js";
import type { EmitResult, Logger } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class ClaudeAdapter extends TargetAdapter {
  targetName = "claude";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const claudeMdPath = join(outDir, "CLAUDE.md");

    if (!dryRun) {
      await atomicWriteFile(claudeMdPath, agentContent);
    }

    this.logger.log(
      `CLAUDE.md ${dryRun ? "(dry-run)" : "written"} at ${claudeMdPath}`,
    );

    return {
      path: claudeMdPath,
      content: agentContent,
      written: !dryRun,
    };
  }
}
