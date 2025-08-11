/*
 * Scan CSS/SCSS files for CSS custom properties and SCSS variables.
 * Reports variables that are used but never defined, with sample references.
 */

const fs = require('fs');
const path = require('path');

const roots = [path.join(process.cwd(), 'src'), path.join(process.cwd(), 'core')];
const exts = new Set(['.scss', '.css']);

function walk(dir, collected = []) {
  if (!fs.existsSync(dir)) return collected;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, collected);
    else if (exts.has(path.extname(entry.name))) collected.push(p);
  }
  return collected;
}

const files = roots.flatMap((r) => walk(r));

const usedCSS = new Map();
const defCSS = new Set();
const usedSCSS = new Map();
const defSCSS = new Set();

function addUse(map, name, file, line) {
  if (!map.has(name)) map.set(name, new Set());
  map.get(name).add(`${path.relative(process.cwd(), file)}:${line}`);
}

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // CSS custom property usage: var(--token ...)
    for (const m of line.matchAll(/var\(\s*--([A-Za-z0-9_-]+)/g)) {
      addUse(usedCSS, m[1], file, i + 1);
    }
    // CSS custom property definition: --token: value
    for (const m of line.matchAll(/(^|;|\{|\s)(--[A-Za-z0-9_-]+)\s*:/g)) {
      defCSS.add(m[2].replace(/^--/, ''));
    }
    // SCSS variable usage: $token
    for (const m of line.matchAll(/\$([A-Za-z0-9_-]+)/g)) {
      addUse(usedSCSS, m[1], file, i + 1);
    }
    // SCSS variable definition: $token: value
    const defMatch = line.match(/^\s*\$([A-Za-z0-9_-]+)\s*:/);
    if (defMatch) defSCSS.add(defMatch[1]);
  }
}

function sampleRefs(map, name, limit = 5) {
  return Array.from(map.get(name) || []).slice(0, limit);
}

const missingCSS = Array.from(usedCSS.keys())
  .filter((k) => !defCSS.has(k))
  .sort()
  .map((name) => ({ name, refs: sampleRefs(usedCSS, name) }));

const missingSCSS = Array.from(usedSCSS.keys())
  .filter((k) => !defSCSS.has(k))
  .sort()
  .map((name) => ({ name, refs: sampleRefs(usedSCSS, name) }));

const result = {
  stats: {
    files: files.length,
    usedCSS: usedCSS.size,
    defCSS: defCSS.size,
    usedSCSS: usedSCSS.size,
    defSCSS: defSCSS.size,
  },
  missingCSS,
  missingSCSS,
};

console.log(JSON.stringify(result, null, 2));


