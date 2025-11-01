import { createReadStream, createWriteStream } from 'node:fs';
import {
  appendFile,
  mkdir as fs_mkdir,
  rm as fs_rm,
  rename,
  stat,
} from 'node:fs/promises';
import { join, resolve, sep, dirname, parse } from 'node:path';
import { pipeline } from 'node:stream/promises';

import { ErrorMessages } from '../constants.js';
import { StdoutInstance } from '../helpers.js';

export class FileSystemService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async cat(path) {
    if (!path) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const filePath = resolve(this.#cwd.path, path);

    try {
      const stdout = new StdoutInstance();
      await pipeline(createReadStream(filePath, 'utf8'), stdout);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async add(filename) {
    if (!filename || filename.includes(sep)) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    try {
      await appendFile(join(this.#cwd.path, filename), '', { flag: 'ax' });
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async mkdir(dirname) {
    if (!dirname || dirname.includes(sep)) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    try {
      await fs_mkdir(join(this.#cwd.path, dirname));
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async rn(path, newFilename) {
    if (!path || !newFilename || newFilename.includes(sep)) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const resolvedSrcPath = resolve(this.#cwd.path, path);
    const srcDir = dirname(resolvedSrcPath);

    try {
      const stats = await stat(path);

      if (!stats.isFile()) {
        throw new Error();
      }

      await rename(resolvedSrcPath, join(srcDir, newFilename));
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async cp(filepath, newDirPath) {
    if (!filepath || !newDirPath) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const _filepath = resolve(this.#cwd.path, filepath);
    const _newDirPath = resolve(this.#cwd.path, newDirPath);
    const { base } = parse(_filepath);
    const copyPath = join(_newDirPath, base);

    if (_filepath === copyPath) {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }

    try {
      const stats = await stat(_filepath);

      if (!stats.isFile()) {
        throw new Error();
      }

      const rs = createReadStream(_filepath);
      const ws = createWriteStream(copyPath);

      await pipeline(rs, ws);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async mv(filepath, newDirPath) {
    if (!filepath || !newDirPath) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const _filepath = resolve(this.#cwd.path, filepath);
    const _newDirPath = resolve(this.#cwd.path, newDirPath);
    const { base } = parse(_filepath);
    const copyPath = join(_newDirPath, base);

    if (_filepath === copyPath) {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }

    try {
      const stats = await stat(_filepath);

      if (!stats.isFile()) {
        throw new Error();
      }

      const src = createReadStream(_filepath);
      const dest = createWriteStream(copyPath);

      await pipeline(src, dest);
      await this.rm(_filepath);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async rm(path) {
    if (!path) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    try {
      await fs_rm(resolve(this.#cwd.path, path), { recursive: true });
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}