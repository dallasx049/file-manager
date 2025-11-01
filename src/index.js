import { AllowedCommands, ErrorMessages } from './constants.js';
import { exitFileManager, getUsername } from './helpers.js';
import {
  CwdService,
  NavigationService,
  FileSystemService,
  OperatingSystemService,
  HashService,
  ArchiveService,
} from './models/index.js';

const init = () => {
  const username = getUsername();

  // Init the services once the app is initialized
  const cwdService = new CwdService();
  const navigationService = new NavigationService(cwdService);
  const fileSystemService = new FileSystemService(cwdService);
  const operatingSystemService = new OperatingSystemService();
  const hashService = new HashService(cwdService);
  const archiveService = new ArchiveService(cwdService);

  // Bind the context to the respective services to not lose this
  const commandProcessors = {
    [AllowedCommands.EXIT]: () => exitFileManager(username),

    [AllowedCommands.CAT]: fileSystemService.cat.bind(fileSystemService),
    [AllowedCommands.ADD]: fileSystemService.add.bind(fileSystemService),
    [AllowedCommands.MKDIR]: fileSystemService.mkdir.bind(fileSystemService),
    [AllowedCommands.RN]: fileSystemService.rn.bind(fileSystemService),
    [AllowedCommands.CP]: fileSystemService.cp.bind(fileSystemService),
    [AllowedCommands.MV]: fileSystemService.mv.bind(fileSystemService),
    [AllowedCommands.RM]: fileSystemService.rm.bind(fileSystemService),

    [AllowedCommands.UP]: navigationService.up.bind(navigationService),
    [AllowedCommands.CD]: navigationService.cd.bind(navigationService),
    [AllowedCommands.LS]: navigationService.ls.bind(navigationService),

    [AllowedCommands.OS]: operatingSystemService.info.bind(operatingSystemService),

    [AllowedCommands.HASH]: hashService.calc.bind(hashService),

    [AllowedCommands.COMPRESS]: archiveService.compress.bind(archiveService),
    [AllowedCommands.DECOMPRESS]: archiveService.decompress.bind(archiveService),
  };

  console.log(`Welcome to the File Manager, ${username}!`);
  cwdService.printPath();

  process.on('SIGINT', () => exitFileManager(username));

  process.stdin.on('data', async (data) => {
    const [command, ...args] = data.toString().trim().split(' ');
    const processor = commandProcessors[command];

    if (!processor) {
      console.log(ErrorMessages.INVALID_INPUT);
      return;
    }

    try {
      await processor(...args);
    } catch (e) {
      console.log(e.message);
    } finally {
      cwdService.printPath();
    }
  });
};

init();
