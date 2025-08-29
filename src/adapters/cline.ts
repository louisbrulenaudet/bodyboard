// src/adapters/cline.ts

import { join } from "node:path";
import { atomicWriteFile, mkdirp } from "../core/fs-util.js";
import type { EmitResult, Logger } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class ClineAdapter extends TargetAdapter {
  targetName = "cline";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const clineDocsDir = join(outDir, ".clinerules");
    const instructionsPath = join(clineDocsDir, "instructions.md");

    if (!dryRun) {
      await mkdirp(clineDocsDir);
      await atomicWriteFile(instructionsPath, agentContent);
    }

    this.logger.log(
      `instructions.md ${dryRun ? "(dry-run)" : "written"} at ${instructionsPath}`,
    );

    return {
      path: instructionsPath,
      content: agentContent,
      written: !dryRun,
    };
  }
}
