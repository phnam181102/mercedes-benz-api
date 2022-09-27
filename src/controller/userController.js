const userService = require('../services/userService')

let getAllUser = async (req, res) => {
    try {
        let user = await userService.getAllUser()
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let registerUser = async (req, res) => {
    try {
        let user = await userService.registerUser(req.body)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let loginUser = async (req, res) => {
    try {
        let user = await userService.loginUser(req.body)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let deleteUser = async (req, res) => {
    try {
        let user = await userService.deleteUser(req.params)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

module.exports = {
    getAllUser, registerUser, loginUser, deleteUser
}