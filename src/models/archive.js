import { stat } from 'node:fs/promises';
import { resolve, parse, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

import { ErrorMessages } from '../constants.js';

export class ArchiveService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async compress(filepath, dest) {
    await this.#processCompression(filepath, dest, true);
  }

  async decompress(filepath, dest) {
    await this.#processCompression(filepath, dest, false);
  }

  async #processCompression(filepath, dest, isCompress) {
    if (!filepath || !dest) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const resolvedFilepath = resolve(this.#cwd.path, filepath);
    const resolvedDestDirPath = resolve(this.#cwd.path, dest);

    try {
      const [_src, _dest] = await Promise.all([
        stat(resolvedFilepath),
        stat(resolvedDestDirPath),
      ]);

      if (!_src.isFile() || !_dest.isDirectory()) {
        throw new Error();
      }

      if (isCompress) {
        const { base } = parse(resolvedFilepath);

        await pipeline(
          createReadStream(resolvedFilepath),
          createBrotliCompress(),
          createWriteStream(join(resolvedDestDirPath, `${base}.br`)),
        );
      } else {
        const { name } = parse(resolvedFilepath);

        await pipeline(
          createReadStream(resolvedFilepath),
          createBrotliDecompress(),
          createWriteStream(join(resolvedDestDirPath, name)),
        );
      }
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}