// An async fn. that returns a call of setInterval, which executes the provided callback fn. You provide the interval duration. This way we can await a setInterval call in our timerHandler fn. in bot/handlers.ts.
exports.setAsyncInterval = async (
  cb: Function,
  interval: number = 0
): Promise<void> => {
  setInterval(() => {
    cb();
  }, interval);
};
