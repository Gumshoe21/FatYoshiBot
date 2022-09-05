"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
exports.router = express.Router();
exports.router
    .route('/createUser')
    .post(/*authController.protect,*/ userController.createUser);
exports.router.route('/getAllUsers').get(userController.getAllUsers);
module.exports = exports.router;
//# sourceMappingURL=userRoutes.js.map