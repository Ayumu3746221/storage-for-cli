import { join } from "node:path";
import { readdir, stat } from "node:fs/promises";
import {
  NotFoundDirectoryError,
  PermissionError,
} from "../errors.js";

export async function scan(dirPath) {
  if (dirPath === undefined) {
    throw new NotFoundDirectoryError(`ディレクトリを指定してください`);
  }

  try {
    const files = await readdir(dirPath, { withFileTypes: true });

    const filePath = files
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name));

    const statPromises = filePath.map(async (filePath) => {
      const fileStat = await stat(filePath);
      return { path: filePath, size: fileStat.size };
    });

    const dirData = await Promise.all(statPromises);

    dirData.forEach((data) => {
      console.log(`${data.path}: ${data.size} bytes`);
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new NotFoundDirectoryError(
        `指定されたディレクトリが存在しません： ${error.message}`,
      );
    } else if (error.code === "EACCES") {
      throw new PermissionError(`権限がありません： ${error.message}`);
    }

    throw error;
  }
}
