import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Writable } from 'node:stream';

import { ErrorMessages } from '../constants.js';

export class HashService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async calc(path) {
    if (!path) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const stdoutInstance = new Writable({
      write(data, encoding, callback) {
        process.stdout.write(data);
        process.stdout.write('\n');
        callback();
      },
    });
    const rs = createReadStream(resolve(this.#cwd.path, path));
    const hash = createHash('sha256').setEncoding('hex');

    try {
      await pipeline(rs, hash, stdoutInstance);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}