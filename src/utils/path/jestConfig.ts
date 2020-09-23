import { workspace } from 'coc.nvim'
import { getConfiguration } from "../configs"
import { findUp } from "./common"

export const makeJestConfigCmd = async () => {
  const jestConfigPath = await findJestConfigPath()

  if (jestConfigPath === "") {
    return ""
  }

  return `--config ${jestConfigPath}`
}

const findJestConfigPath = async () => {
  const { root } = workspace
  const config = await getConfiguration()
  const configFileName = config.get<string>("configFileName")

  const configPath = await findUp(configFileName, root)

  if (configPath === "") {
    return ""
  }

  return `${configPath}/${configFileName}`
}
