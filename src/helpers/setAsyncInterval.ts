exports.setAsyncInterval = async (
  cb: Function,
  timeout: number = 0
): Promise<void> => {
  setInterval(() => {
    cb();
  }, timeout);
};
//
