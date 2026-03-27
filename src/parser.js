import { parseArgs } from "node:util";
import { ValidationError } from "./errors.js";

export function parseArguments() {
  try {
    const { values, positionals } = parseArgs({
      args: process.argv.slice(2),
      allowPositionals: true,
    });

    if (positionals.length === 0) {
      throw new ValidationError(
        "Error: using `node cli.js <command> <dilectory> [option]",
      );
    }

    return {
      command: positionals[0],
      targetPath: positionals[1],
      flags: values,
    };
  } catch (error) {
    if (error.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
      throw new ValidationError(
        `無効なオプションが指定されました： ${error.message}`,
      );
    }
    throw error;
  }
}
