#!/usr/bin/env node
// Validates that this rules pack follows the anti-collision placement
// contract: hub.json declares the extension id, and every rule file is a
// flat rules/cam-ext-<id>-<name>.md markdown document with a level-1
// heading and at least 1 KB of content.
// Zero dependencies; requires Node 22 or later.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const rulesDir = join(repoRoot, 'rules');
const KEBAB_ID = /^[a-z0-9](-?[a-z0-9]){2,39}$/;

function fail(message) {
  console.error(`validate: FAIL - ${message}`);
  process.exit(1);
}

let hub;
try {
  hub = JSON.parse(await readFile(join(repoRoot, 'hub.json'), 'utf8'));
} catch {
  fail('hub.json is missing or not valid JSON');
}
const id = hub.id;
if (typeof id !== 'string' || !KEBAB_ID.test(id)) {
  fail("hub.json must declare a unique kebab-case extension 'id'");
}
if (hub.kind !== 'rules-pack') {
  fail(`hub.json kind must be 'rules-pack' (found '${hub.kind}')`);
}
if (hub.contentDir !== 'rules') {
  fail(`hub.json contentDir must be 'rules' (found '${hub.contentDir}')`);
}

let entries;
try {
  entries = await readdir(rulesDir, { withFileTypes: true });
} catch {
  fail('rules/ directory does not exist');
}

if (entries.some((entry) => entry.isDirectory())) {
  fail('rules/ is a flat shared directory; subdirectories are not allowed');
}

const stray = entries
  .filter((entry) => entry.isFile() && !entry.name.toLowerCase().endsWith('.md'))
  .map((entry) => entry.name);
if (stray.length > 0) {
  fail(`rules/ may only carry markdown files: ${stray.join(', ')}`);
}

const prefix = `cam-ext-${id}-`;
const ruleFiles = entries
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

if (ruleFiles.length < 3) {
  fail(`expected at least 3 markdown rule files in rules/, found ${ruleFiles.length}`);
}

for (const name of ruleFiles) {
  if (!name.startsWith(prefix)) {
    fail(`rules/${name} must be named ${prefix}<name>.md (shared-directory prefix)`);
  }
  if (name.slice(prefix.length) === '.md') {
    fail(`rules/${name} has an empty name after the ${prefix} prefix`);
  }

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

console.log(`validate: OK - ${ruleFiles.length} rule files in rules/ carry the ${prefix} prefix and are well-formed`);
