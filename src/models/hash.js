import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

import { ErrorMessages } from '../constants.js';
import { StdoutInstance } from '../helpers.js';

export class HashService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async calc(path) {
    if (!path) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const stdout = new StdoutInstance();
    const rs = createReadStream(resolve(this.#cwd.path, path));
    const hash = createHash('sha256').setEncoding('hex');

    try {
      await pipeline(rs, hash, stdout);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}