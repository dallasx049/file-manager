import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { ErrorMessages } from '../constants.js';

export class ArchiveService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async compress(src, dest) {
    if (!src || !dest) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    try {
      await pipeline(
        createReadStream(resolve(this.#cwd.path, src)),
        createBrotliCompress(),
        createWriteStream(resolve(this.#cwd.path, dest)),
      );
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async decompress(src, dest) {
    if (!src || !dest) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    try {
      await pipeline(
        createReadStream(resolve(this.#cwd.path, src)),
        createBrotliDecompress(),
        createWriteStream(resolve(this.#cwd.path, dest)),
      );
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}