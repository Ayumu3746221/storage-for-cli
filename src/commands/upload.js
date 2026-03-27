import { constants } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join, basename } from "node:path";
import {
  NotFoundDirectoryError,
  PermissionError,
  FileAlreadyExistsError,
} from "../errors.js";

export async function upload(filePath) {
  if (filePath === undefined) {
    throw new NotFoundDirectoryError(`ファイルパスを指定してください`);
  }

  const fileName = basename(filePath);
  const destPath = join(process.env.STORAGE, fileName);

  try {
    await copyFile(filePath, destPath, constants.COPYFILE_EXCL);
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
