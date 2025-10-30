import { homedir } from 'node:os';

import { AllowedCommands } from './constants.js';
import { exitFileManager, getUsernameFromArgv } from './helpers.js';
import {
  CwdService,
  NavigationService,
  FileSystemService,
} from './models/index.js';

const init = () => {
  const username = getUsernameFromArgv(process.argv);
  const cwd = new CwdService(homedir());

  const navigation = new NavigationService(cwd);
  const fileSystem = new FileSystemService(cwd);

  const { cd, ls, up } = navigation;
  const { add, rm, cat, rn, mv, mkdir, cp } = fileSystem;

  const handlers = {
    [AllowedCommands.CAT]: cat.bind(fileSystem),
    [AllowedCommands.ADD]: add.bind(fileSystem),
    [AllowedCommands.MKDIR]: mkdir.bind(fileSystem),
    [AllowedCommands.RN]: rn.bind(fileSystem),
    [AllowedCommands.CP]: cp.bind(fileSystem),
    [AllowedCommands.MV]: mv.bind(fileSystem),
    [AllowedCommands.RM]: rm.bind(fileSystem),

    [AllowedCommands.UP]: up.bind(navigation),
    [AllowedCommands.CD]: cd.bind(navigation),
    [AllowedCommands.LS]: ls.bind(navigation),

    [AllowedCommands.EXIT]: () => exitFileManager(username),
  };

  console.log(`Welcome to the File Manager, ${username}!`);
  cwd.print();

  process.on('SIGINT', () => exitFileManager(username));

  process.stdin.on('data', async (data) => {
    const [command, ...args] = data.toString().trim().split(' ');
    const handler = handlers[command];

    try {
      if (!handler) {
        throw new Error('Invalid input');
      }
      await handler(...args);
    } catch (e) {
      console.log(e.message);
    } finally {
      cwd.print();
    }
  });
};

init();
