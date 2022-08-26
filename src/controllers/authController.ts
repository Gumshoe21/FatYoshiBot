import crypto from 'crypto';
const { promisify } = require('util'); // utility for promisify method
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
import catchAsync from './../utils/catchAsync';
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: '5d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true
  };

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) check if user exists && passowrd is correct
  const user = await User.findOne({ email }).select('+password'); // we are selecting password here because we need it in order to check if it is correct - now it will be back in the output
  // short circuiting down here btw
  if (!user || !(await user.correctPassword(password, user.password))) {
    // if not user or password incorrect
    return next(new AppError('Ioncrrect email or password', 401)); // 401 = unauthorized
  }
  // 3) if everything okay, send token to client
  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (_req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true
  };

  res.cookie('jwt', 'loggedOut', cookieOptions);

  res.status(202).json({ status: 'success' });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies['jwt']) {
    token = req.cookies['jwt'];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  //2) verification token - making sure the token hasn't been manipulated by malicious 3rd party
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  // if no one tampered with the token...
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // if current user doesn't exist, don't give access to route, throw err
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }
  // user does exist at this point
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // iat = issued at
    return next(
      new AppError('User recently changed password; please log in again', 401)
    );
    // GRANT ACCESS TO PROTECTED ROUTE
  }

  req.user = currentUser; // very important for next step to work, otherwise no access to role
  res.locals.user = currentUser;
  next();
});

exports.restrict = () => {
  return (req, _res, next) => {
    if (!req.user.isAdmin) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      ); // 403 === forbidden
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in; send JWT to user
  createSendToken(user, 200, res);
});
