exports.isCommand = (message: string): boolean => {
  const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
  return regexpCommand.test(message);
};
