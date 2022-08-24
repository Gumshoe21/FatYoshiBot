import { Request, Response, NextFunction } from 'express';
module.exports = (fn: Function): Function => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
