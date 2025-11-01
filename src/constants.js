const AllowedCommands = {
  EXIT: '.exit',
  UP: 'up',
  CD: 'cd',
  LS: 'ls',
  CAT: 'cat',
  ADD: 'add',
  MKDIR: 'mkdir',
  RN: 'rn',
  CP: 'cp',
  MV: 'mv',
  RM: 'rm',
  OS: 'os',
  HASH: 'hash',
  COMPRESS: 'compress',
  DECOMPRESS: 'decompress',
};

const AllowedOSArgs = {
  EOL: '--EOL',
  CPUS: '--cpus',
  HOMEDIR: '--homedir',
  USERNAME: '--username',
  ARCH: '--architecture',
};

const ErrorMessages = {
  INVALID_INPUT: 'Invalid input',
  OPERATION_FAILED: 'Operation failed',
};

export {
  AllowedCommands,
  AllowedOSArgs,
  ErrorMessages,
};
