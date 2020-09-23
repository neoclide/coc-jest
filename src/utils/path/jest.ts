import { workspace } from 'coc.nvim'
import { isFileExist } from "./common"
import path from "path"

export const makeJestBinCmd = async () => {
  const jestBinPath = await findJestBinPath()

  if (jestBinPath === "") {
    return "jest"
  }

  return `node ${jestBinPath}`
}

const findJestBinPath = async () => {
  const { root } = workspace

  for (let name of ["jest", "jest.cmd"]) {
    const jestPath = path.join(root, `node_modules/.bin/${name}`)
    const exists = await isFileExist(jestPath)

    if (exists) {
      return path.join(root, `./node_modules/.bin/${name}`)
    }
  }

  return ""
}
