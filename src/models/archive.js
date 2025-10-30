import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

export class ArchiveService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async compress(src, dest) {
    if (!src || !dest) {
      throw new Error('Invalid input');
    }

    try {
      await pipeline(
        createReadStream(resolve(this.#cwd.path, src)),
        createBrotliCompress(),
        createWriteStream(resolve(this.#cwd.path, dest)),
      );
    } catch {
      throw new Error('Operation failed');
    }
  }

  async decompress(src, dest) {
    if (!src || !dest) {
      throw new Error('Invalid input');
    }

    try {
      await pipeline(
        createReadStream(resolve(this.#cwd.path, src)),
        createBrotliDecompress(),
        createWriteStream(resolve(this.#cwd.path, dest)),
      );
    } catch {
      throw new Error('Operation failed');
    }
  }
}