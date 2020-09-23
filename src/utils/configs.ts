import { workspace } from 'coc.nvim'

let optionsNames = [
  "detectLeaks",
  "watchman",
  "detectOpenHandles",
  "forceExit",
  "noStackTrace",
]

export const getJestFlagsFromConfig = async (): Promise<string> => {
  let args = []

  const config = await getConfiguration()

  for (let name of optionsNames) {
    if (config.get<boolean>(name)) {
      args.push(`--${name}`)
    }
  }
  if (config.get("customFlags")) {
    for (let flag of config.get<String[]>("customFlags")) {
      args.push(`--${flag}`)
    }
  }
  return args.join(" ")
}

export const getTerminalPosition = async (): Promise<string> => {
  const config = await getConfiguration()
  const terminalPosition = config.get<string>('terminalPosition')

  if (terminalPosition === undefined) {
    return 'right'
  }

  return terminalPosition
}

export const isWatchAllCmd = async () => {
  const watch = await isWatch()

  if (watch) {
    return ' --watchAll'
  }

  return ''
}

export const isWatchCmd = async () => {
  const watch = await isWatch()

  if (watch) {
    return ' --watch'
  }

  return ''
}

const isWatch = async () => {
  const config = await getConfiguration()

  return config.get('watch')
}

export const getConfiguration = async () => {
  let document = await workspace.document
  return workspace.getConfiguration('jest', document ? document.uri : undefined)
}
