// scripts/generate-icon-map.js
const fs   = require('fs');
const path = require('path');

// Define __dirname for ES modules using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const iconsDir = path.join(__dirname, '../assets/icons');
const outFile  = path.join(__dirname, '../app/iconMap.ts');

// Read all .png files
const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.png'));

if (files.length === 0) {
  console.warn(`⚠️  No .png files found in ${iconsDir}`);
  process.exit(0);
}

// Build the TS file content
const lines = files.map((f) => {
  const key = path.basename(f, '.png');
  return `  "${key}": require("../assets/icons/${f}")`;
});

const content = `// THIS FILE IS AUTO‑GENERATED — do not edit by hand
export const iconMap: Record<string, any> = {
${lines.join(',\n')}
};
`;

fs.writeFileSync(outFile, content, 'utf8');
console.log(`✅ Generated ${outFile} with ${files.length} icons.`);
