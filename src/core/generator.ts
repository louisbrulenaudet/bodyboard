// src/core/generator.ts

import { relative } from "node:path";
import ora from "ora";
import type { TargetAdapter } from "../adapters/base.js";
import type { EmitResult, Logger } from "./types.js";

export class MultiTargetGenerator {
  private adapters: TargetAdapter[];
  private logger: Logger;

  constructor(adapters: TargetAdapter[], logger: Logger) {
    this.adapters = adapters;
    this.logger = logger;
  }

  private createProgressBar(
    current: number,
    total: number,
    width = 20,
  ): string {
    const percentage = current / total;
    const filled = Math.round(width * percentage);
    const empty = width - filled;

    const filledChar = "█";
    const emptyChar = "░";

    return `[${filledChar.repeat(filled)}${emptyChar.repeat(empty)}]`;
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

    // Explicitly log the "Surf's up!" message before spinner
    this.logger.log(`✨ Surf's up! Generating all ${total} targets...`);
    const mainSpinner = ora({
      text: `🏄 Surf's up! Generating all ${total} targets...`,
      spinner: "dots",
      color: "cyan",
    }).start();

    try {
      for (let i = 0; i < total; i++) {
        const adapter = this.adapters[i];
        if (!adapter) continue;

        // Update spinner text to show current progress with better formatting
        const done = i + 1;
        const percentage = Math.round((done / total) * 100);
        const progressBar = this.createProgressBar(done, total, 20);

        mainSpinner.text = `🏄‍♂️ ${progressBar} ${adapter.targetName} (${done}/${total} - ${percentage}%)`;

        const adapterStartTime = Date.now();
        const result = await adapter.emit(agentContent, outDir, dryRun);
        const adapterDuration = Date.now() - adapterStartTime;

        results.push(result);

        // Show completion for this adapter with better formatting
        const status = result.written ? "✅" : "🤙";
        const action = result.written ? "Generated" : "Dry-run";
        const relativePath = this.getRelativePath(result.path, process.cwd());
        const timing =
          adapterDuration > 1000
            ? `(${(adapterDuration / 1000).toFixed(1)}s)`
            : `(${adapterDuration}ms)`;

        mainSpinner.succeed(
          `${status} ${action}: ${adapter.targetName} → ${relativePath} ${timing}`,
        );

        this.logger.debug(
          `${adapter.targetName} completed in ${adapterDuration}ms`,
        );

        // Restart spinner for next item if not the last one
        if (i < total - 1) {
          mainSpinner.start();
        }
      }

      this.logger.log("🌊 Ready for the next wave!");
    } catch (error) {
      mainSpinner.fail("❌ Generation failed");
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

    // Create spinner for single target generation
    const spinner = ora({
      text: `🏄‍♂️ Surf's up! Generating ${adapter.targetName}...`,
      spinner: "dots",
      color: "cyan",
    }).start();

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
        spinner.succeed(
          `Generated: ${adapter.targetName} → ${relativePath} ${timing}`,
        );
      } else if (result) {
        const relativePath = this.getRelativePath(result.path, process.cwd());
        const timing =
          duration > 1000
            ? `(${(duration / 1000).toFixed(1)}s)`
            : `(${duration}ms)`;
        spinner.succeed(
          `🤙 Dry-run: ${adapter.targetName} → ${relativePath} ${timing}`,
        );
        this.logger.info(`Dry-run completed for ${adapter.targetName}`);
      } else {
        spinner.fail(`❌ Failed to generate: ${adapter.targetName}`);
        this.logger.error(`Generation failed for ${adapter.targetName}`);
      }

      this.logger.debug(`${adapter.targetName} completed in ${duration}ms`);
      this.logger.log("🌊 Ready for the next wave!");
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      spinner.fail(`❌ Failed to generate: ${adapter.targetName}`);
      this.logger.error(
        `Generation failed for ${adapter.targetName}: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.logger.debug(`Failed after ${duration}ms`);
      throw error;
    }
  }
}
