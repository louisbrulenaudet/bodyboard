// src/adapters/base.ts

import type { EmitResult, Logger } from "../core/types.js";

export abstract class TargetAdapter {
  abstract targetName: string;

  protected logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  abstract emit(
    agentContent: string,
    outDir: string,
    dryRun?: boolean,
  ): Promise<EmitResult>;
}
