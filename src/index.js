import { homedir } from 'node:os';

import { AllowedCommands } from './constants.js';
import { exitFileManager, getUsernameFromArgv } from './helpers.js';
import {
  CwdService,
  NavigationService,
  FileSystemService,
  OperatingSystemService,
  HashService,
  ArchiveService,
} from './models/index.js';

const init = () => {
  const username = getUsernameFromArgv(process.argv);
  const cwd = new CwdService(homedir());

  // Init the services once the app is initialized
  const navigationService = new NavigationService(cwd);
  const fileSystemService = new FileSystemService(cwd);
  const operatingSystemService = new OperatingSystemService();
  const hashService = new HashService(cwd);
  const archiveService = new ArchiveService(cwd);

  const { cd, ls, up } = navigationService;
  const { add, rm, cat, rn, mv, mkdir, cp } = fileSystemService;
  const { info } = operatingSystemService;
  const { calc } = hashService;
  const { compress, decompress } = archiveService;

  // Bind the context to the respective services to not lose this
  const handlers = {
    [AllowedCommands.EXIT]: () => exitFileManager(username),

    [AllowedCommands.CAT]: cat.bind(fileSystemService),
    [AllowedCommands.ADD]: add.bind(fileSystemService),
    [AllowedCommands.MKDIR]: mkdir.bind(fileSystemService),
    [AllowedCommands.RN]: rn.bind(fileSystemService),
    [AllowedCommands.CP]: cp.bind(fileSystemService),
    [AllowedCommands.MV]: mv.bind(fileSystemService),
    [AllowedCommands.RM]: rm.bind(fileSystemService),

    [AllowedCommands.UP]: up.bind(navigationService),
    [AllowedCommands.CD]: cd.bind(navigationService),
    [AllowedCommands.LS]: ls.bind(navigationService),

    [AllowedCommands.OS]: info.bind(operatingSystemService),

    [AllowedCommands.HASH]: calc.bind(hashService),

    [AllowedCommands.COMPRESS]: compress.bind(archiveService),
    [AllowedCommands.DECOMPRESS]: decompress.bind(archiveService),
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
