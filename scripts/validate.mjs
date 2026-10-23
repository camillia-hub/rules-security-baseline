#!/usr/bin/env node
// Validates that this rules pack has a well-formed rules/ directory.
// Zero dependencies; requires Node 22 or later.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const rulesDir = fileURLToPath(new URL('../rules/', import.meta.url));

function fail(message) {
  console.error(`validate: FAIL - ${message}`);
  process.exit(1);
}

let entries;
try {
  entries = await readdir(rulesDir, { withFileTypes: true });
} catch {
  fail('rules/ directory does not exist');
}

const ruleFiles = entries
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

if (ruleFiles.length < 3) {
  fail(`expected at least 3 markdown rule files in rules/, found ${ruleFiles.length}`);
}

for (const name of ruleFiles) {
  const filePath = join(rulesDir, name);
  const raw = await readFile(filePath, 'utf8');
  // Strip a UTF-8 BOM (U+FEFF) if present so the heading check is not fooled.
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

  if (!content.startsWith('# ')) {
    fail(`rules/${name} must start with a level-1 heading ("# ")`);
  }

  const sizeBytes = Buffer.byteLength(content, 'utf8');
  if (sizeBytes < 1024) {
    fail(`rules/${name} is ${sizeBytes} bytes; each rule file must be at least 1 KB`);
  }
}

console.log(`validate: OK - ${ruleFiles.length} rule files in rules/ are well-formed`);
