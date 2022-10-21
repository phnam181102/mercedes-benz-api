const express = require('express');
const router = express.Router();
const middlewareController = require('../controller/middlewareController');
const userController = require('../controller/userController');

router.get('/', middlewareController.verifyToken, userController.getAllUser);
router.post('/register', userController.registerUser);

router.get('/verify/:userId/:uniqueString', userController.verifyEmail);
router.get('/verified', userController.verified);

router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:userId/:uniqueString', userController.resetPassword);
router.post('/reset-password/:userId/:uniqueString', userController.sendResetPassword);
router.get('/reset', userController.reset);

router.post('/login', userController.loginUser);
router.post('/refresh', userController.requestRefreshToken);
router.delete('/:_id', middlewareController.verifyTokenAdmin, userController.deleteUser);

module.exports = router;
