import { Uri, workspace } from "coc.nvim"
import path from "path"
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
  const config = await getConfiguration()
  const configFileName = config.get<string>("configFileName")

  let cwd = workspace.cwd;
  if (document) {
    const uri = Uri.parse(document.uri);
    cwd = uri.scheme == "file" ? path.dirname(uri.fsPath) : cwd;
  }

  const configPath = await findUp(configFileName, cwd)

  if (configPath === "") {
    return ""
  }

  return `${configPath}/${configFileName}`
}
