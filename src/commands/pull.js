import { constants } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import {
  NotFoundDirectoryError,
  PermissionError,
  FileAlreadyExistsError,
} from "../errors.js";

export async function pull(fileName) {
  if (fileName === undefined) {
    throw new NotFoundFileErrorError(`ファイルを指定してください`);
  }

  const copyedPath = join(process.env.STORAGE, fileName);
  const destPath = join(cwd(), fileName);

  try {
    await copyFile(copyedPath, destPath, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new NotFoundDirectoryError(
        `指定されたファイルまたはディレクトリが存在しません： ${error.message}`,
      );
    } else if (error.code === "EACCES") {
      throw new PermissionError(`権限がありません： ${error.message}`);
    } else if (error.code === "EEXIST") {
      throw new FileAlreadyExistsError(
        `ファイルは既に存在します： ${error.message}`,
      );
    }

    throw error;
  }
}
