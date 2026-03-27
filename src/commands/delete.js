import { join } from "node:path";
import { rm } from "fs/promises";
import { NotFoundFileError, PermissionError } from "../errors.js";

export async function deleteFile(targetFile) {
  const filePath = join(process.env.STORAGE, targetFile);

  try {
    await rm(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new NotFoundFileError(`ファイルが見つかりません： ${targetFile}`);
    } else if (error.code === "EACCES") {
      throw new PermissionError(`権限がありません： ${error.message}`);
    }

    throw error;
  }
}
