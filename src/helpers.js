import { Writable } from 'node:stream';

const exitFileManager = (username) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
};

const getUsername = () => {
  const args = process.argv.slice(2);
  return args[0]?.split('=')[1] || 'Anonymous';
};

class StdoutInstance extends Writable {
  constructor() {
    super();
  }

  _write(chunk, encoding, callback) {
    process.stdout.write(chunk);
    process.stdout.write('\n');
    callback();
  }
}

export {
  exitFileManager,
  getUsername,
  StdoutInstance,
};
