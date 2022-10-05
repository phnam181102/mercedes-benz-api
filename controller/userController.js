const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const userController = {
    getAllUser: async (req, res) => {
        try {
            let user = await User.find();
            return res.status(200).json({
                message: 'This is all users',
                user: user,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    message: 'Please fill in all fields.',
                });
            }

            if (!validateEmail(email)) {
                return res.status(400).json({
                    message: 'Invalid email',
                });
            }

            const findEmail = await User.findOne({ email });

            if (findEmail) {
                return res.status(400).json({
                    errMessage: 'This email already exists',
                });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            let newUser = await new User({
                username: username,
                email: email,
                password: passwordHash,
            });

            let user = await newUser.save();

            return res.status(200).json({
                message: 'Register success!',
                user: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
    loginUser: async (req, res) => {
        try {
            let { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Please fill in all fields.',
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    message: 'This email does not exists',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Password is incorrect',
                });
            }

            if (user && isMatch) {
                const accessToken = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);
                refreshTokens.push(refreshToken); //save refresh token in array (db)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...others } = user._doc;
                res.status(400).json({
                    message: 'login success!',
                    user: { ...others, accessToken },
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '10m' }
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '90d' }
        );
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: "You're not authenticated" });
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(400).json({ message: 'Refresh token is not valid' });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken); //filter new token

            //Create new accessToken, refreshToken
            const newAccessToken = userController.generateAccessToken(user);
            const newRefreshToken = userController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params._id);
            resolve({
                message: 'Delete user success!',
                user: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
};

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}

module.exports = userController;
