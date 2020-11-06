import { workspace } from "coc.nvim"
import { fileURLToPath } from "url"
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
  const document = await workspace.document
  const documentPath = fileURLToPath(document.uri)
  const config = await getConfiguration()
  const configFileName = config.get<string>("configFileName")

  const configPath = await findUp(configFileName, documentPath)

  if (configPath === "") {
    return ""
  }

  return `${configPath}/${configFileName}`
}
