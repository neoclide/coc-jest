import { Workspace } from "coc.nvim/lib/workspace"
import { Uri } from "coc.nvim"

export const getCurrentFilePath = async (ws: Workspace) => {
  const currentDocument = await ws.document

  return Uri.parse(currentDocument.uri).fsPath
}
