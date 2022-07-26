const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/createUser')
  .post(/*authController.protect,*/ userController.createUser);
router.route('/getAllUsers').get(userController.getAllUsers);
module.exports = router;
