#!/usr/bin/env node
// src/cli.ts

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { ClineAdapter } from "./adapters/cline.js";
import { CopilotAdapter } from "./adapters/copilot.js";
import { GeminiAdapter } from "./adapters/gemini.js";
import { MultiTargetGenerator } from "./core/generator.js";
import { parseAgentDoc } from "./core/parser.js";
import type { LogLevel, Logger } from "./core/types.js";

class ConsoleLogger implements Logger {
  verbose: boolean;

  constructor(verbose: boolean) {
    this.verbose = verbose;
  }

  private formatTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `[${time}]`;
  }

  private shouldShow(message: string, level: LogLevel = "info"): boolean {
    // Always show fun logs and important messages regardless of verbosity
    const funPatterns = [
      "Surf's up!",
      "Success!",
      "Dry-run",
      "Finished generating",
      "🏄‍♂️",
      "🎉",
      "🤙",
      "🌊",
      "✨",
      "[#",
      "Generated:",
      "All targets generated",
    ];

    const isImportant =
      level === "error" || level === "warn" || level === "success";
    const isFun = funPatterns.some((pattern) => message.includes(pattern));

    return this.verbose || isImportant || isFun;
  }

  log(message: string, level: LogLevel = "info"): void {
    if (!this.shouldShow(message, level)) return;

    const timestamp = this.verbose ? `${this.formatTimestamp()} ` : "";
    const formattedMessage = `${timestamp}${message}`;

    console.log(formattedMessage);
  }

  success(message: string): void {
    const timestamp = this.verbose ? `${this.formatTimestamp()} ` : "";
    const icon = "✅";
    console.log(`${timestamp}${icon} ${message}`);
  }

  error(message: string): void {
    const timestamp = this.verbose ? `${this.formatTimestamp()} ` : "";
    const icon = "❌";
    console.error(`${timestamp}${icon} ${message}`);
  }

  warn(message: string): void {
    if (!this.shouldShow(message, "warn")) return;

    const timestamp = this.verbose ? `${this.formatTimestamp()} ` : "";
    const icon = "⚠️";
    console.log(`${timestamp}${icon} ${message}`);
  }

  info(message: string): void {
    this.log(message, "info");
  }

  debug(message: string): void {
    if (!this.verbose) return;

    const timestamp = this.formatTimestamp();
    const icon = "🔍";
    console.log(`${timestamp} ${icon} ${message}`);
  }
}

function usage() {
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args[0] !== "create") usage();

  const verbose = args.includes("--verbose");

  let target = typeof args[1] === "string" ? args[1] : "";
  if (target === "--all") target = "all";
  const outIdx = args.indexOf("--out");
  const outDir =
    outIdx !== -1 &&
    typeof args[outIdx + 1] === "string" &&
    args[outIdx + 1] !== undefined
      ? resolve(args[outIdx + 1] as string)
      : process.cwd();
  const dryRun = args.includes("--dry-run");

  const logger = new ConsoleLogger(verbose);

  const agentDocPath = join(process.cwd(), "AGENTS.md");
  if (!existsSync(agentDocPath)) {
    logger.error("AGENTS.md not found in current directory.");
    process.exit(2);
  }

  const agentContent = await parseAgentDoc(agentDocPath);

  const adapters = [
    new GeminiAdapter(logger),
    new CopilotAdapter(logger),
    new ClineAdapter(logger),
  ];

  const generator = new MultiTargetGenerator(adapters, logger);

  if (target === "all") {
    await generator.generateAll(agentContent, outDir, dryRun);
  } else {
    const validTargets = adapters.map((a) => a.targetName);
    if (!validTargets.includes(target)) {
      logger.error(`Unknown target: ${target}`);
      usage();
    }
    // Only call generateOne if target is a valid string
    await generator.generateOne(target as string, agentContent, outDir, dryRun);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(3);
});
