const User = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.find()
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                user: user
            })
        } catch (error) {
            reject(e)
        }
    })
}

let registerUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {username, email, password} = data
            
            if (!username || !email || !password) {
                return resolve({
                    errMessage: "Please fill in all fields."
                })
            }

            const findEmail = await User.findOne({email})

            if (findEmail) {
                return resolve({
                    errMessage: "This email already exists"
                })
            }

            const passwordHash = await bcrypt.hash(password, 12)

            let newUser = await new User({
                username: username, 
                email: email, 
                password: passwordHash
            })

            let user = await newUser.save()

            resolve({
                errCode: 0,
                errMessage: "Register success!",
                user: user
            })

        } catch (error) {
            reject(error)
        }
    })
}

let loginUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {email, password} = data
            
            if (!email || !password) {
                return resolve({
                    errMessage: "Please fill in all fields."
                })
                
            }

            const user = await User.findOne({email})

            if (!user) {
                return resolve({
                    errMessage: "This email does not exists"
                })
                
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return resolve({
                    errMessage: "Password is incorrect"
                })
            }

            if (user && isMatch) {
                const accessToken = generateAccessToken(user)
                const refreshToken = generateRefreshToken(user)
                // error
                // res.cookie("refreshToken", refreshToken, {
                //     httpOnly: true,
                //     secure: false,
                //     path: "/",
                //     sameSite: "strict"
                // })
                const {password, ...others} = user._doc
                resolve({
                    errCode: 0,
                    errMessage: "login success!",
                    user: {...others, accessToken}
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "10m"}
    )
}

let generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "90d"}
    )
}

let deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndDelete(data._id)
            resolve({
                errCode: 0,
                errMessage: "Delete user success!",
                user: user
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getAllUser, registerUser, loginUser, deleteUser
}