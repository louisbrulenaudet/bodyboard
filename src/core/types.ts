// src/core/types.ts

export interface AgentDoc {
  title: string;
  description: string;
  sections: Array<{ heading: string; content: string }>;
}

export interface Target {
  name: string;
  outputPath: string;
}

export interface EmitResult {
  path: string;
  content: string;
  written: boolean;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

export interface Logger {
  verbose: boolean;
  log(message: string, level?: LogLevel): void;
  error(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
}
