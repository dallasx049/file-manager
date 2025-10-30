export class CwdService {
  #path;

  constructor(path) {
    this.#path = path;
  }

  get path() {
    return this.#path;
  }

  set path(value) {
    this.#path = value;
  }

  print() {
    console.log(`You are currently in ${this.#path}`);
  }
}
