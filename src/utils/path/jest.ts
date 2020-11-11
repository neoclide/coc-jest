import { platform } from 'os';
import { workspace } from 'coc.nvim';
import { join, normalize } from 'path';
import { readFileSync, existsSync } from 'fs';

/**
 * Known binary names of `react-scripts` forks
 */
const createReactAppBinaryNames = [
  'react-scripts',
  'react-native-scripts',
  'react-scripts-ts',
  'react-app-rewired',
];

/**
 * File extension for npm binaries
 */
const nodeBinExtension: string = platform() === 'win32' ? '.cmd' : '';

/**
 * Resolves the location of an npm binary
 *
 * Returns the path if it exists, or `undefined` otherwise
 */
const getLocalPathForExecutable = (rootPath: string, executable: string): string => {
  const absolutePath = normalize(
    join(rootPath, 'node_modules', '.bin', executable + nodeBinExtension),
  );
  return existsSync(absolutePath) ? absolutePath : undefined;
};

/**
 * Tries to read the test command from the scripts section within `package.json`
 *
 * Returns the test command in case of success,
 * `undefined` if there was an exception while reading and parsing `package.json`
 * `null` if there is no test script
 */
const getTestCommand = (rootPath: string): string | undefined | null => {
  try {
    const packagePath = join(rootPath, 'package.json');
    const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
    if (packageJSON?.scripts?.test) {
      return packageJSON.scripts.test;
    }
    return null;
  } catch {
    return undefined;
  }
};

/**
 * Checks if the supplied test command could have been generated by create-react-app
 */
const isCreateReactAppTestCommand = (testCommand: string): boolean => {
  return (
    !!testCommand &&
    createReactAppBinaryNames.some((binary) => testCommand.includes(`${binary} test`))
  );
};

/**
 * Checks if the project in `rootPath` was bootstrapped by `create-react-app`.
 */
const isBootstrappedWithCreateReactApp = (rootPath: string): boolean => {
  const testCommand = getTestCommand(rootPath);
  if (testCommand === undefined) {
    // In case parsing `package.json` failed or was unconclusive,
    // fallback to checking for the presence of the binaries in `./node_modules/.bin`
    return createReactAppBinaryNames.some(
      (binary) => getLocalPathForExecutable(rootPath, binary) !== undefined,
    );
  }
  return isCreateReactAppTestCommand(testCommand);
};

/**
 * Handles getting the jest runner, handling the OS and project specific work too
 */
const findJestBinPath = (): string => {
  const { root } = workspace;

  if (isBootstrappedWithCreateReactApp(root)) {
    return `npm test --`;
  }

  const jestBinPath = getLocalPathForExecutable(root, `jest${nodeBinExtension}`);

  if (jestBinPath) {
    return `node ${jestBinPath}`;
  }

  return '';
};

/**
 * Returns the command to run jest. It handles OS and CRA bootstrapped projects
 */
export const makeJestBinCmd = async () => {
  const jestBinPath = findJestBinPath();

  if (jestBinPath === '') {
    return 'jest';
  }

  return jestBinPath;
};

