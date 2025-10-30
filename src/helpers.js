const exitFileManager = (username) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
};

const getUsernameFromArgv = (argv) => {
  const args = argv.slice(2);
  return args[0]?.split('=')[1] || 'Anonymous';
};

export {
  exitFileManager,
  getUsernameFromArgv,
};
