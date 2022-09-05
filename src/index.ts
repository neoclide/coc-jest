import { commands, ExtensionContext, window, workspace } from 'coc.nvim'
import path from 'path'
import {
  getJestFlagsFromConfig, getTerminalPosition, getJestBinCmd,
  isWatchAllCmd,
  isWatchCmd
} from "./utils/configs"
import { findNearestTest } from "./utils/findTest"
import { makeJestBinCmd } from "./utils/path/jest"
import { makeJestConfigCmd } from "./utils/path/jestConfig"

const { nvim } = workspace

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context

  subscriptions.push(commands.registerCommand("jest.init", initJest))
  subscriptions.push(commands.registerCommand("jest.projectTest", runProject))
  subscriptions.push(commands.registerCommand("jest.fileTest", runFile))
  subscriptions.push(
    commands.registerCommand("jest.singleTest", runSingleTest),
  )
}

async function initJest(): Promise<void> {
  let { root } = workspace

  window.runTerminalCommand("jest --init", root)
}

async function runProject(): Promise<void> {
  const cmd = await isWatchAllCmd()
  await runJestCommand(cmd)
}

async function getReltivePath(): Promise<string> {
  const currentFilePath = await workspace.nvim.eval('expand("%:p")') as string
  return path.relative(workspace.cwd, currentFilePath)
}

async function runFile(): Promise<void> {
  const watchCmd = await isWatchCmd()
  const currentFilePath = await getReltivePath()
  const cmd = `--runTestsByPath ${currentFilePath} ${watchCmd}`
  await runJestCommand(cmd)
}

async function runSingleTest(): Promise<void> {
  const watchCmd = await isWatchCmd()
  let testName = await findNearestTest()
  testName = testName.replace(/"/g, '\\"').replace(/(?<!\\)'/g, "\\'")
  const currentFilePath = await getReltivePath()
  return runJestCommand(`--runTestsByPath ${currentFilePath} -t="${testName}" ${watchCmd}`)
}

async function runJestCommand(cmd = ""): Promise<void> {
  const jestConfigCmd = await makeJestConfigCmd()
  const jestBinCmd = await getJestBinCmd() || await makeJestBinCmd()

  await openTerminal(`${jestBinCmd} ${jestConfigCmd} ${cmd}`)
}

let terminalBufnr
async function openTerminal(cmd: string): Promise<void> {
  const flags = await getJestFlagsFromConfig()
  const position = await getTerminalPosition()

  if (terminalBufnr) {
    nvim.command(`silent! bd! ${terminalBufnr}`, true)
    terminalBufnr = undefined
  }

  terminalBufnr = await nvim.call("coc#util#open_terminal", {
    autoclose: 0,
    keepfocus: 1,
    position,
    cwd: workspace.cwd,
    cmd: `${cmd} ${flags}`,
  }) as number
}
