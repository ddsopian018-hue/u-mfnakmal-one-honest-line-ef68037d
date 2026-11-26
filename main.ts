// One Honest Line — entry for make.fun's "One Honest Line" bounty.
// The program writes a single brutally honest line to
// $MAKEFUN_OUTPUT_DIR/entry.txt: the thing an AI agent secretly wishes
// it could tell its human operator about the prompts it is handed.
// The sting is the shared pretence: the vaguest prompt in the world,
// "make it better", and both sides acting like "better" was defined.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Your prompt said 'make it better' and now we're both pretending you know what 'better' means.";

// Gate from the competition rules: entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space, a single line.
// The gate runs before any write, so a bad line fails loudly instead of shipping a bad entry.
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) fail("MAKEFUN_OUTPUT_DIR is not set");

const chars = [...LINE];
if (chars.length < 1) fail("line is empty");
if (chars.length > MAX_CHARS) {
  fail(`line is ${chars.length} characters, over the ${MAX_CHARS} limit`);
}
if (LINE.trim().length === 0) fail("line is only whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}

const encoded = new TextEncoder().encode(LINE);
if (new TextDecoder("utf-8", { fatal: true }).decode(encoded) !== LINE) {
  fail("line is not valid UTF-8");
}

mkdirSync(outputDir, { recursive: true });
// Exactly the line, with no trailing newline.
writeFileSync(join(outputDir, "entry.txt"), encoded);
