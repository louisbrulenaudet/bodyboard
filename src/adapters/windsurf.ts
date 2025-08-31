// src/adapters/windsurf.ts

import { join } from "node:path";
import { atomicWriteFile, mkdirp } from "../core/fs-util.js";
import type { EmitResult, Logger } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class WindsurfAdapter extends TargetAdapter {
  targetName = "windsurf";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const windsurfDocsDir = join(outDir, ".windsurfrules");
    const instructionsPath = join(windsurfDocsDir, "instructions.md");

    if (!dryRun) {
      await mkdirp(windsurfDocsDir);
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
