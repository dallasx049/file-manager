import { resolve, join } from 'node:path';
import { readdir, access, constants } from 'node:fs/promises';
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
      await access(newPath, constants.R_OK);
      this.#cwd.path = newPath;
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }

  async ls() {
    try {
      const contents = await readdir(this.#cwd.path, { withFileTypes: true });
      const table = contents
        .map((dirent) => ({
          Name: dirent.name,
          Type: dirent.isFile() ? 'file' : 'directory',
        })).sort((a, b) => a.Name.localeCompare(b.Name) && a.Type.localeCompare(b.Type));
      console.table(table);
    } catch {
      throw new Error(ErrorMessages.OPERATION_FAILED);
    }
  }
}