import os from 'node:os';
import { AllowedOSArgs } from '../constants.js';

export class OperatingSystemService {
  constructor() {}

  info(arg) {
    if (!Object.values(AllowedOSArgs).includes(arg)) {
      throw new Error('Invalid input');
    }

    switch (arg) {
      case AllowedOSArgs.EOL: {
        console.log(os.EOL === '\n' ? '\\n' : '\\r\\n');
        break;
      }
      case AllowedOSArgs.CPUS: {
        const cpus = os.cpus();
        const info = cpus.map((core) => ({
          model: core.model,
          clockRate: core.speed / 1000,
        }));
        console.log(`Amount: ${cpus.length}`);
        console.log(info);
        break;
      }
      case AllowedOSArgs.HOMEDIR: {
        console.log(os.homedir());
        break;
      }
      case AllowedOSArgs.USERNAME: {
        console.log(os.userInfo().username);
        break;
      }
      case AllowedOSArgs.ARCH: {
        console.log(os.arch());
        break;
      }
    }
  }
}