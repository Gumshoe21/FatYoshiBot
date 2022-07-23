const express = require('express');

const router = express.Router();

router
  .route('/createUser')
  .post(authController.protect, userController.createUser);
