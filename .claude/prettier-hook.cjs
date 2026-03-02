#!/usr/bin/env node
// Hook PostToolUse : lance Prettier sur le fichier modifié par Edit ou Write
// Utilise l'API JS de Prettier (pas de subprocess) pour éviter les problèmes de chemins Windows
const path = require("path");
const fs = require("fs");

const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", async () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = input.tool_input?.file_path;
    if (!filePath) process.exit(0);

    const prettier = require(
      path.join(__dirname, "..", "node_modules", "prettier"),
    );
    const source = fs.readFileSync(filePath, "utf8");
    const config = await prettier.resolveConfig(filePath);
    const formatted = await prettier.format(source, {
      ...config,
      filepath: filePath,
    });
    fs.writeFileSync(filePath, formatted, "utf8");
  } catch (e) {
    process.stderr.write(`[prettier-hook] ${e.message}\n`);
    process.exit(0);
  }
});
