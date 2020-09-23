import { Workspace } from "coc.nvim/lib/workspace"
import { isFileExist } from "./common"
import path from "path"

export const makeJestBinCmd = async (ws: Workspace) => {
  const jestBinPath = await findJestBinPath(ws)

  if (jestBinPath === "") {
    return "jest"
  }

  return `node ${jestBinPath}`
}

const findJestBinPath = async (ws: Workspace) => {
  const { root } = ws

  for (let name of ["jest", "jest.cmd"]) {
    const jestPath = path.join(root, `node_modules/.bin/${name}`)
    const exists = await isFileExist(jestPath)

    if (exists) {
      return path.join(root, `./node_modules/.bin/${name}`)
    }
  }

  return ""
}
