"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('./../models/User');
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const factory = require('./handlerFactory');
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
/*
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
*/
exports.getMe = (req, _res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default('This route is not for password updates; please use /updateMyPasword', 400));
    }
    // 2) update user doc if not
    /* Now why am I putting x here, and not simply request.body? Well that's because we actually do not want to update everything that's in the body, because let's say the user puts, in the body, the role for example. We could have body.role set to admin for example, and so this would then allow any user to change the role, for example, to administrator. And of course that can not be allowed. Or the user could also change their reset token, or when that reset token expires, and all of that should not be allowed of course. So doing something like this would of course be a huge mistake. And so we need to make sure that the object that we pass here, so again that object that will contain the data that's gonna be updated, only contains name and email, because for now these are the only fields that we want to allow to update. And so basically we want to filter the body so that in the end, it only contains name and email and nothing else. So if then the user tries to change the role, that will then be filtered out so that it never finds its way to our database. lecture 138*/
    // filtered out unwanted field names that are now allowed to be updated
    const filteredBody = filterObj(req.body, 'email', 'role');
    const updatedUser = yield User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    }); // we can use AndUpdate b/c not using password
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
}));
exports.deleteMe = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
exports.getUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id).populate('timer', '_id');
        res.json(user);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
exports.createUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: parseInt(doc)
        }
    });
}));
exports.deleteUser = (_req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
// do NOT update passwords with this!
// exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
//# sourceMappingURL=userController.js.map