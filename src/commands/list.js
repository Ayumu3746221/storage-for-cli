import { scan } from "./scan.js";
import { PermissionError } from "../errors.js";

export async function list() {
  try {
    const storagePath = process.env.STORAGE;
    await scan(storagePath);
  } catch (error) {
    if (error.code === "EACCES") {
      throw new PermissionError(`権限がありません： ${error.message}`);
    } else {
      throw error;
    }
  }
}
