import { parseArguments } from "./parser.js";
import { dispatchCommand } from "./dispatcher.js";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../config/.env");

loadEnvFile(envPath);

try {
  const config = parseArguments();
  console.log("解析成功：", config);
  await dispatchCommand(config);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
