import { resolve, join } from 'node:path';
import { readdir, stat } from 'node:fs/promises';

import { ErrorMessages } from '../constants.js';

export class NavigationService {
  #cwd;

  constructor(cwd) {
    this.#cwd = cwd;
  }

  up() {
    this.#cwd.path = join(this.#cwd.path, '..');
  }

  async cd(path) {
    if (!path) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    const newPath = resolve(this.#cwd.path, path);

    try {
      const stats = await stat(newPath);

      if (!stats.isDirectory()) {
        throw new Error();
      }

      this.#cwd.path = newPath;
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async ls() {
    try {
      const contents = await readdir(this.#cwd.path, { withFileTypes: true });
      const contentsTable = contents.map((dirent) => ({
        Name: dirent.name,
        Type: dirent.isFile() ? 'file' : 'directory',
      })).sort((a, b) => a.Name.localeCompare(b.Name) && a.Type.localeCompare(b.Type));

      if (contentsTable.length) {
        console.table(contentsTable);
      }
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}