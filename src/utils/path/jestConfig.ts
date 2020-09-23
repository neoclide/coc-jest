import { Workspace } from "coc.nvim/lib/workspace"
import { getConfiguration } from "../configs"
import { findUp } from "./common"

export const makeJestConfigCmd = async (ws: Workspace) => {
  const jestConfigPath = await findJestConfigPath(ws)

  if (jestConfigPath === "") {
    return ""
  }

  return `--config ${jestConfigPath}`
}

const findJestConfigPath = async (ws: Workspace) => {
  const { root } = ws
  const config = await getConfiguration(ws)
  const configFileName = config.get<string>("configFileName")

  const configPath = await findUp(configFileName, root)

  if (configPath === "") {
    return ""
  }

  return `${configPath}/${configFileName}`
}
