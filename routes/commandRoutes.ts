const express = require('express');
const { route } = require('../app');

const router = express.Router();

router.use(authController.restrict());

router
  .route('/:id')
  .get(commandController.getCommand)
  .patch(commandController.updateCommand)
  .delete(commandController.deleteCommand);

router
  .route('/createCommand')
  .post(authController.protect, userController.createCommand);

router.route('/getAllCommands').get(commandController.getAllCommands);
