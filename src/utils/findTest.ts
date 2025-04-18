import { Document, workspace } from 'coc.nvim'

export const findNearestTest = async () => {
  const doc = await workspace.document
  const { nvim } = workspace
  const lineNumber = ((await nvim.call('line', '.')) as number) - 1

  return findTestName(doc, lineNumber)
}

const findTestName = (doc: Document, lineNumber: number) => {
  const line = doc.getline(lineNumber)
  const matchedArray = line.match(/^\s*(?:it|test|describe)\((["'])(.+)\1/)
  if (matchedArray != undefined) {
    return matchedArray[2]
  }
  if (lineNumber === 0) return undefined
  return findTestName(doc, lineNumber - 1)
}
