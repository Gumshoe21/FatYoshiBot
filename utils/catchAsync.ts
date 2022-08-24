module.exports = (fn: Function): Function => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
