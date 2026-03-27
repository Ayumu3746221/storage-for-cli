import { NotFoundCommandError } from "./errors.js";
import { scan } from "./commands/scan.js";
import { help } from "./commands/help.js";
import { upload } from "./commands/upload.js";
import { list } from "./commands/list.js";
import { deleteFile } from "./commands/delete.js";
import { pull } from "./commands/pull.js";

export async function dispatchCommand({ command, targetPath }) {
  const commandTable = {
    scan: () => scan(targetPath),
    list: () => list(),
    upload: () => upload(targetPath),
    pull: () => pull(targetPath),
    delete: () => deleteFile(targetPath),
    help: () => help(),
  };

  console.log(`command : ${command}`);

  if (!commandTable[command]) {
    throw new NotFoundCommandError(
      `コマンド "${command}" は存在しません。利用可能なコマンド: ${Object.keys(commandTable).join(", ")}`,
    );
  }

  await commandTable[command]();
}
