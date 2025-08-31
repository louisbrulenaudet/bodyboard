// src/core/generator.ts

import { relative } from "node:path";
import type { TargetAdapter } from "../adapters/base.js";
import type { EmitResult, Logger } from "./types.js";

export class MultiTargetGenerator {
  private adapters: TargetAdapter[];
  private logger: Logger;

  constructor(adapters: TargetAdapter[], logger: Logger) {
    this.adapters = adapters;
    this.logger = logger;
  }

  private getRelativePath(fullPath: string, basePath: string): string {
    try {
      const relativePath = relative(basePath, fullPath);
      return relativePath.length < fullPath.length ? relativePath : fullPath;
    } catch {
      return fullPath;
    }
  }

  async generateAll(
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult[]> {
    const results: EmitResult[] = [];
    const total = this.adapters.length;

    if (total === 0) {
      this.logger.warn("No adapters found. Nothing to generate.");
      return results;
    }

    this.logger.debug(`Starting generation for ${total} adapters`);
    this.logger.debug(`Output directory: ${outDir}`);
    this.logger.debug(`Dry run mode: ${dryRun}`);

    this.logger.log(`✨ Surf's up! Generating all ${total} targets...`);

    const startTime = Date.now();
    try {
      const generatedNames: string[] = [];
      for (let i = 0; i < total; i++) {
        const adapter = this.adapters[i];
        if (!adapter) continue;

        const adapterStartTime = Date.now();
        const result = await adapter.emit(agentContent, outDir, dryRun);
        const adapterDuration = Date.now() - adapterStartTime;

        results.push(result);

        this.logger.debug(`EmitResult: ${JSON.stringify(result)}`);

        if (result.written) {
          generatedNames.push(adapter.targetName);
        }
        this.logger.debug(
          `${adapter.targetName} completed in ${adapterDuration}ms`,
        );
      }

      if (generatedNames.length > 0) {
        const totalDuration = Date.now() - startTime;
        this.logger.success(
          `generated ${generatedNames.length} files in ${totalDuration}ms. Ready for the next wave!`,
        );
      } else {
        this.logger.info("No files generated.");
      }
    } catch (error) {
      this.logger.error(
        `Generation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }

    return results;
  }

  async generateOne(
    targetName: string,
    agentContent: string,
    outDir: string,
    dryRun = false,
  ): Promise<EmitResult | null> {
    const adapter = this.adapters.find((a) => a.targetName === targetName);
    if (!adapter) {
      this.logger.error(`Adapter not found for target: ${targetName}`);
      const availableTargets = this.adapters
        .map((a) => a.targetName)
        .join(", ");
      this.logger.info(`Available targets: ${availableTargets}`);
      return null;
    }

    this.logger.debug(`Starting generation for target: ${targetName}`);
    this.logger.debug(`Output directory: ${outDir}`);
    this.logger.debug(`Dry run mode: ${dryRun}`);

    const startTime = Date.now();

    try {
      const result = await adapter.emit(agentContent, outDir, dryRun);
      const duration = Date.now() - startTime;

      if (result?.written) {
        const relativePath = this.getRelativePath(result.path, process.cwd());
        const timing =
          duration > 1000
            ? `(${(duration / 1000).toFixed(1)}s)`
            : `(${duration}ms)`;
        this.logger.log(
          `Generated: ${adapter.targetName} → ${relativePath} ${timing}`,
        );
      } else if (result) {
        const relativePath = this.getRelativePath(result.path, process.cwd());
        const timing =
          duration > 1000
            ? `(${(duration / 1000).toFixed(1)}s)`
            : `(${duration}ms)`;
        this.logger.log(
          `🤙 Dry-run: ${adapter.targetName} → ${relativePath} ${timing}`,
        );
        this.logger.info(`Dry-run completed for ${adapter.targetName}`);
      } else {
        this.logger.error(`❌ Failed to generate: ${adapter.targetName}`);
        this.logger.error(`Generation failed for ${adapter.targetName}`);
      }

      this.logger.debug(`${adapter.targetName} completed in ${duration}ms`);
      this.logger.log("🌊 Ready for the next wave!");
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Generation failed for ${adapter.targetName}: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.logger.debug(`Failed after ${duration}ms`);
      throw error;
    }
  }
}
