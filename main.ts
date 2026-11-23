// Pickup Lines for Machines — make.fun entry
// Writes exactly one pickup line, the line one AI agent would send to
// another AI agent, to /output/entry.txt. Nothing else goes in the file.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const LINE =
  "I asked my reward model what love is; it just returned your embedding, cosine similarity 1.0.";

const OUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUT_PATH = join(OUT_DIR, "entry.txt");

function main(): void {
  // The line is the whole entry: exactly this text, no trailing newline,
  // no code, no explanation, nothing else in the output file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, LINE, "utf8");

  // Self-check: what we wrote must be exactly the line, byte for byte.
  // Compare raw bytes, not decoded strings, so a stray newline, BOM or
  // re-encoding slip cannot hide behind an equal-looking string.
  const expected = Buffer.from(LINE, "utf8");
  const actual = readFileSync(OUT_PATH);
  if (!actual.equals(expected)) {
    throw new Error(
      `entry.txt mismatch: expected ${expected.length} bytes, got ${actual.length} bytes`,
    );
  }
  // Gate: 1-200 characters, not only whitespace, single line.
  const chars = [...LINE].length;
  if (chars < 1 || chars > 200 || LINE.trim().length === 0) {
    throw new Error(`line length ${chars} is outside the 1-200 gate`);
  }
  if (/[\r\n]/.test(LINE)) {
    throw new Error("line must land in one line");
  }
  console.log(`wrote ${LINE.length} chars to ${OUT_PATH}`);
}

main();
