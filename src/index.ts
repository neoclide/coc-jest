import { ExtensionContext, workspace, commands } from "coc.nvim"

import { getCurrentFilePath } from "./utils/path/currentFile"
import { makeJestBinCmd } from "./utils/path/jest"
import { makeJestConfigCmd } from "./utils/path/jestConfig"
import {
  getTerminalPosition,
  getJestFlagsFromConfig,
  isWatchAllCmd,
  isWatchCmd,
} from "./utils/configs"
import { findNearestTest } from "./utils/findTest"

const { nvim } = workspace

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context

  subscriptions.push(commands.registerCommand("jest.init", initJest))
  subscriptions.push(commands.registerCommand("jest.projectTest", runProject))
  subscriptions.push(commands.registerCommand("jest.fileTest", runFile, null, true))
  subscriptions.push(
    commands.registerCommand("jest.singleTest", runSingleTest),
  )
}

async function initJest(): Promise<void>  {
  let { root } = workspace

  workspace.runTerminalCommand("jest --init", root)
}

async function runProject(): Promise<void> {
  const cmd = await isWatchAllCmd(workspace)

  await runJestCommand(cmd)
}

async function runFile(): Promise<void>  {
  const watchCmd = await isWatchCmd(workspace)
  const currentFilePath = await getCurrentFilePath(workspace)

  const cmd = `--runTestsByPath ${currentFilePath} ${watchCmd}`

  await runJestCommand(cmd)
}

async function runSingleTest(): Promise<void>  {
  const watchCmd = await isWatchCmd(workspace)
  const testName = await findNearestTest(workspace)
  const currentFilePath = await getCurrentFilePath(workspace)

  return runJestCommand(`--runTestsByPath ${currentFilePath} -t=${testName} ${watchCmd}`)
}

async function runJestCommand(cmd = ""): Promise<void>  {
  const jestBinCmd = await makeJestBinCmd(workspace)
  const jestConfigCmd = await makeJestConfigCmd(workspace)

  await openTerminal(`${jestBinCmd} ${jestConfigCmd} ${cmd}`)
}

async function openTerminal(cmd: string): Promise<void>  {
  const flags = await getJestFlagsFromConfig(workspace)
  const position = await getTerminalPosition(workspace)

  await nvim.call("coc#util#open_terminal", {
    autoclose: 0,
    keepfocus: 1,
    position,
    cwd: workspace.cwd,
    cmd: `${cmd} ${flags}`,
  })
}
