const express = require('express')
const middlewareController = require('../controller/middlewareController')
const router = express.Router()
const userController = require('../controller/userController')

let initWebRoute = (app) => {
    router.get('/', middlewareController.verifyToken, userController.getAllUser)
    router.post('/register', userController.registerUser)
    router.post('/login', userController.loginUser)
    router.delete('/:_id', middlewareController.verifyTokenAdmin, userController.deleteUser)

    return app.use('/user', router)
}

module.exports = initWebRoute