"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require('express');
const { route } = require('../app');
const commandController = require('./../controllers/commandController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
exports.router = express.Router();
exports.router.use(authController.restrict());
exports.router
    .route('/:id')
    .get(commandController.getCommand)
    .patch(commandController.updateCommand)
    .delete(commandController.deleteCommand);
exports.router
    .route('/createCommand')
    .post(authController.protect, userController.createCommand);
exports.router.route('/getAllCommands').get(commandController.getAllCommands);
//# sourceMappingURL=commandRoutes.js.map