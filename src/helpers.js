const exitFileManager = (username) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
};

const getUsername = () => {
  const args = process.argv.slice(2);
  return args[0]?.split('=')[1] || 'Anonymous';
};

export {
  exitFileManager,
  getUsername,
};
