const express = require('express');
const router = express.Router();
const middlewareController = require('../controller/middlewareController');
const userController = require('../controller/userController');

// router.get('/', middlewareController.verifyToken, userController.getAllUser);
router.get('/', userController.getAllUser);
router.post('/register', userController.registerUser);
router.get('/verify/:userId/:uniqueString', userController.verifyEmail);
router.get('/verified', userController.verified);
router.post('/login', userController.loginUser);
router.post('/refresh', userController.requestRefreshToken);
// router.delete('/:_id', middlewareController.verifyTokenAdmin, userController.deleteUser);
router.delete('/:_id', userController.deleteUser);

module.exports = router;
