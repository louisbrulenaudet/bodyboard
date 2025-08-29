// src/core/fs-util.ts

import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";

export async function mkdirp(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function atomicWriteFile(
  filePath: string,
  content: string,
): Promise<void> {
  const dir = dirname(filePath);
  await mkdirp(dir);
  const tmpPath = join(dir, `.tmp-${randomBytes(8).toString("hex")}`);
  await fs.writeFile(tmpPath, content, "utf8");
  await fs.rename(tmpPath, filePath);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
