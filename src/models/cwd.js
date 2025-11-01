import { homedir } from 'node:os';

export class CwdService {
  #path = homedir();

  constructor() {}

  get path() {
    return this.#path;
  }

  set path(value) {
    this.#path = value;
  }

  printPath() {
    console.log(`You are currently in ${this.#path}`);
  }
}
