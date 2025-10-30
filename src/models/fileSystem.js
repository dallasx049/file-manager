import { createReadStream, createWriteStream } from 'node:fs';
import {
  appendFile,
  mkdir as fs_mkdir,
  rm as fs_rm,
  rename,
} from 'node:fs/promises';
import { join, resolve, sep, dirname, parse } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Writable } from 'node:stream';

export class FileSystemService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  async cat(path) {
    if (!path) {
      throw new Error('Invalid input');
    }

    const filePath = resolve(this.#cwd.path, path);

    try {
      const writable = new Writable({
        write(chunk, encoding, cb) {
          process.stdout.write(chunk, encoding, cb);
        },
      });
      await pipeline(createReadStream(filePath, 'utf8'), writable);
    } catch {
      throw new Error('Operation failed');
    }
  }

  async add(filename) {
    if (!filename || filename.includes(sep)) {
      throw new Error('Invalid input');
    }

    const filePath = join(this.#cwd.path, filename);

    try {
      await appendFile(filePath, '', { flag: 'ax' });
    } catch {
      throw new Error('Operation failed');
    }
  }

  async mkdir(dirname) {
    if (!dirname || dirname.includes(sep)) {
      throw new Error('Invalid input');
    }

    try {
      await fs_mkdir(join(this.#cwd.path, dirname));
    } catch {
      throw new Error('Operation failed');
    }
  }

  async rn(path, newFilename) {
    if (!path || !newFilename || newFilename.includes(sep)) {
      throw new Error('Invalid input');
    }

    const fileDir = dirname(resolve(this.#cwd.path, path));

    try {
      await rename(resolve(this.#cwd.path, path), resolve(fileDir, newFilename));
    } catch {
      throw new Error('Operation failed');
    }
  }

  async cp(filepath, newDirPath) {
    if (!filepath || !newDirPath) {
      throw new Error('Invalid input');
    }

    const _filepath = resolve(this.#cwd.path, filepath);
    const _newDirPath = resolve(this.#cwd.path, newDirPath);
    const { base } = parse(_filepath);
    const copyPath = join(_newDirPath, base);

    if (_filepath === copyPath) {
      throw new Error('Invalid input');
    }

    const src = createReadStream(_filepath, 'utf8');
    const dest = createWriteStream(copyPath);

    try {
      await pipeline(src, dest);
    } catch {
      throw new Error('Operation failed');
    }
  }

  async mv(filepath, newDirPath) {
    if (!filepath || !newDirPath) {
      throw new Error('Invalid input');
    }

    const _filepath = resolve(this.#cwd.path, filepath);
    const _newDirPath = resolve(this.#cwd.path, newDirPath);
    const { base } = parse(_filepath);
    const copyPath = join(_newDirPath, base);

    if (_filepath === copyPath) {
      throw new Error('Invalid input');
    }

    const src = createReadStream(_filepath, 'utf8');
    const dest = createWriteStream(copyPath);

    try {
      await pipeline(src, dest);
      await this.rm(_filepath);
    } catch {
      throw new Error('Operation failed');
    }
  }

  async rm(path) {
    if (!path) {
      throw new Error('Invalid input');
    }

    try {
      await fs_rm(resolve(this.#cwd.path, path), {
        force: true,
        recursive: true,
      });
    } catch {
      throw new Error('Operation failed');
    }
  }
}