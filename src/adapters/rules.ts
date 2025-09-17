// src/adapters/rules.ts

import { join } from "node:path";
import { atomicWriteFile, mkdirp } from "../core/fs-util.js";
import type { EmitResult } from "../core/types.js";
import { TargetAdapter } from "./base.js";

export class RulesAdapter extends TargetAdapter {
  targetName = "rules";

  async emit(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult> {
    const rulesDir = join(outDir, ".rules");
    const rulesPath = join(rulesDir, "rules.md");

    if (!dryRun) {
      await mkdirp(rulesDir);
      await atomicWriteFile(rulesPath, agentContent);
    }

    this.logger.log(
      `rules.md ${dryRun ? "(dry-run)" : "written"} at ${rulesPath}`,
    );

    return {
      path: rulesPath,
      content: agentContent,
      written: !dryRun,
    };
  }
}
