import fs from "fs"
import path from "path"
import util from "util"

export const findUp = async (
  filename: string,
  cwd: string,
): Promise<string> => {
  if (cwd === "/") {
    return ""
  }

  const packagePath = path.join(cwd, filename)
  const exists = await isFileExist(packagePath)

  if (exists) {
    return cwd
  }

  return findUp(filename, path.dirname(cwd))
}

export const isFileExist = async (filepath: string) => {
  try {
    const stat = await util.promisify(fs.stat)(filepath)

    return stat.isFile()
  } catch (e) {
    return false
  }
}
