// src/core/parser.ts

import { readFile } from "node:fs/promises";

export async function parseAgentDoc(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (err) {
    throw new Error(
      `Failed to read agent doc file "${filePath}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
