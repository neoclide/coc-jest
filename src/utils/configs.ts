import { Workspace } from 'coc.nvim/lib/workspace'

let optionsNames = [
    "detectLeaks",
    "watchman",
    "detectOpenHandles",
    "forceExit",
    "noStackTrace",
]

export const getJestFlagsFromConfig = async (ws: Workspace): Promise<string> => {
    let args = []

    const config = await getConfiguration(ws)

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

export const getTerminalPosition = async (ws: Workspace): Promise<string> => {
    const config = await getConfiguration(ws)
    const terminalPosition = config.get<string>('terminalPosition')

    if (terminalPosition === undefined) {
        return 'right'
    }

    return terminalPosition
}

export const isWatchAllCmd = async (ws: Workspace) => {
    const watch = await isWatch(ws)

    if (watch) {
        return ' --watchAll'
    }

    return ''
}

export const isWatchCmd = async (ws: Workspace) => {
    const watch = await isWatch(ws)

    if (watch) {
        return ' --watch'
    }

    return ''
}

const isWatch = async (ws: Workspace) => {
    const config = await getConfiguration(ws)

    return config.get('watch')
}

export const getConfiguration = async (ws: Workspace) => {
    let document = await ws.document
    return ws.getConfiguration('jest', document ? document.uri : undefined)
}