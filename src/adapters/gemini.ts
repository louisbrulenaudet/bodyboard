// src/adapters/gemini.ts

import { join } from "node:path";
import { atomicWriteFile } from "../core/fs-util.js";
import type { EmitResult } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class GeminiAdapter extends TargetAdapter {
  targetName = "gemini";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const geminiMdPath = join(outDir, "GEMINI.md");

    if (!dryRun) {
      await atomicWriteFile(geminiMdPath, agentContent);
    }

    this.logger.log(
      `GEMINI.md ${dryRun ? "(dry-run)" : "written"} at ${geminiMdPath}`,
    );

    return {
      path: geminiMdPath,
      content: agentContent,
      written: !dryRun,
    };
  }
}
