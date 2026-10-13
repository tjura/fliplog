import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

try {
  writeFileSync(
    ".env",
    `BETTER_AUTH_SECRET=${randomBytes(32).toString("hex")}\n`,
    { flag: "wx", mode: 0o600 },
  );
  console.log("Created private local runtime configuration (.env)");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  // A copied .env.example has no secret; fail before the app container does.
  if (!/^BETTER_AUTH_SECRET=\S{32,}$/m.test(readFileSync(".env", "utf8"))) {
    console.error(
      "Add BETTER_AUTH_SECRET (32+ characters) to .env, or remove .env to generate one.",
    );
    process.exit(1);
  }
  console.log("Using existing private runtime configuration");
}
