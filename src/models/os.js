import { cpus, homedir, userInfo, arch, EOL } from 'node:os';

import { AllowedOSArgs, ErrorMessages } from '../constants.js';

export class OperatingSystemService {
  constructor() {}

  info(arg) {
    switch (arg) {
      case AllowedOSArgs.EOL: {
        console.log(EOL === '\n' ? '\\n' : '\\r\\n');
        break;
      }
      case AllowedOSArgs.CPUS: {
        const mappedCpus = cpus().map((core) => ({
          model: core.model,
          clockRate: core.speed / 1000,
        }));
        console.log(`Amount: ${mappedCpus.length}`);
        console.log(mappedCpus);
        break;
      }
      case AllowedOSArgs.HOMEDIR: {
        console.log(homedir());
        break;
      }
      case AllowedOSArgs.USERNAME: {
        console.log(userInfo().username);
        break;
      }
      case AllowedOSArgs.ARCH: {
        console.log(arch());
        break;
      }
      default: {
        throw new Error(ErrorMessages.INVALID_INPUT);
      }
    }
  }
}