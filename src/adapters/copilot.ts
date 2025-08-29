// src/adapters/copilot.ts

import { join } from "node:path";
import { atomicWriteFile, mkdirp } from "../core/fs-util.js";
import type { EmitResult, Logger } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class CopilotAdapter extends TargetAdapter {
  targetName = "copilot";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const githubDir = join(outDir, ".github");
    const copilotPath = join(githubDir, "copilot-instructions.md");

    if (!dryRun) {
      await mkdirp(githubDir);
      await atomicWriteFile(copilotPath, agentContent);
    }

    this.logger.log(
      `copilot-instructions.md ${dryRun ? "(dry-run)" : "written"} at ${copilotPath}`,
    );

    return {
      path: copilotPath,
      content: agentContent,
      written: !dryRun,
    };
  }
}
