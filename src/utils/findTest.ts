import { Workspace } from 'coc.nvim/lib/workspace'
import { Document } from 'coc.nvim/lib'

export const findNearestTest = async (ws: Workspace) => {
    const doc = await ws.document
    const { nvim } = ws
    const lineNumber = ((await nvim.call('line', '.')) as number) - 1

    return findTestName(doc, lineNumber)
}

const findTestName = (doc: Document, lineNumber: number) => {
    if (lineNumber < 0) {
        return ''
    }

    const line = doc.getline(lineNumber)
    const matchedArray = line.match(/^\s*(?:it|test|describe)\((["'])(.+)\1/)

    if (matchedArray != undefined) {
        return matchedArray[2]
    }

    return findTestName(doc, lineNumber - 1)
}
