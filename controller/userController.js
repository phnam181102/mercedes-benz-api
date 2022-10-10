const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('./sendVerificationEmail');

let refreshTokens = [];

const userController = {
    getAllUser: async (req, res) => {
        try {
            let user = await User.find();
            return res.status(200).json({
                message: 'This is all users',
                user: user,
            });
        } catch (err) {
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
                    message: 'This email already exists',
                });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            let newUser = await new User({
                username: username,
                email: email,
                password: passwordHash,
                verified: false,
            });

            let user = await newUser.save();
            
            let url = "api/users/verify/";
            sendVerificationEmail(
              user,
              "complete the signup and login into your account",
              url,
              res
            );
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
    verifyEmail: async (req, res) => {
        let { userId, uniqueString } = req.params;

        UserVerification.find({ userId })
            .then((result) => {
                if (result.length > 0) {
                    const { expiresAt } = result[0];
                    const hashedUniqueString = result[0].uniqueString;

                    if (expiresAt < Date.now()) {
                        UserVerification.deleteOne({ userId })
                            .then((result) => {
                                User.deleteOne({ _id: userId })
                                    .then(() => {
                                        let message = 'Link has expired. Please sign up again.';
                                        res.redirect(
                                            `/api/users/verified/error=true&message=${message}`
                                        );
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        let message =
                                            'Clearing user with expired unique string failed';
                                        res.redirect(
                                            `/api/users/verified/error=true&message=${message}`
                                        );
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                let message =
                                    'An error occurred while clearing expired user verification record';
                                res.redirect(`/api/users/verified/error=true&message=${message}`);
                            });
                    } else {
                        bcrypt
                            .compare(uniqueString, hashedUniqueString)
                            .then((result) => {
                                if (result) {
                                    User.updateOne({ _id: userId }, { verified: true })
                                        .then(() => {
                                            UserVerification.deleteOne({ userId })
                                                .then(() => {
                                                    res.send('Email Verified');
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    let message =
                                                        'An error occurred while finalizing successful verification.';
                                                    res.redirect(
                                                        `/api/users/verified/error=true&message=${message}`
                                                    );
                                                });
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            let message =
                                                'An error occurred while updating user record to show verified.';
                                            res.redirect(
                                                `/api/users/verified/error=true&message=${message}`
                                            );
                                        });
                                } else {
                                    let message =
                                        'Invalid verification details passed. Check your inbox.';
                                    res.redirect(
                                        `/api/users/verified/error=true&message=${message}`
                                    );
                                }
                            })
                            .catch((err) => {
                                console.log(err);

                                let message = 'An error occurred while comparing unique strings.';
                                res.redirect(`/api/users/verified/error=true&message=${message}`);
                            });
                    }
                } else {
                    let message =
                        "Account doesn't exist or has been verified already. Please signup or login.";
                    res.redirect(`/api/users/verified/error=true&message=${message}`);
                }
            })
            .catch((err) => {
                console.log(err);
                let message =
                    'An error occurred while checking for existing user verification record.';
                res.redirect(`/api/users/verified/error=true&message=${message}`);
            });
    },
    verified: async (req, res) => {
        res.send(req.params.message);
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
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error from the server',
            });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await User.findOne({email})
            if (!user) return res.status(400).json({message: "This email does not exist."})

            const url = `api/users/reset/`;

            sendVerificationEmail(user, "to reset the password in your account", url, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Error from the server",
            });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            const passwordHash = await bcrypt.hash(password, 12)
            
            await User.findByIdAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            res.json({message: "Password successfully changed!"})
        } catch (error) {
            return res.status(500).json({ msg: error.message });
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
    updateUser: async (req, res) => {
        try {
            const {username} = req.body
            await User.findOneAndUpdate({_id: req.user.id}, {
                username
            })

            res.json({message: "Update Success!"})
        } catch (error) {
            console.log(err);
            return res.status(500).json({
                message: "Error from the server",
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params._id);
            res.status(400).json({
                message: 'Delete user success!',
                user: user,
            });
        } catch (err) {
            console.log(err);
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
