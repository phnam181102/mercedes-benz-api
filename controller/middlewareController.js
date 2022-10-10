const jwt = require('jsonwebtoken');
const User = require('../models/User');

const middlewareController = {
    verifyToken: (req, res, next) => {
        try {
            const token = req.headers.token;
            if (token) {
                const accessToken = token.split(' ')[1];
                jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                        console.log(err)
                        res.status(403).json({ errMessage: 'Token is not valid' });
                    }
                    req.user = user;
                    next();
                });
            } else {
                res.status(401).json({ errMessage: "You're not authenticated" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {
            const user = await User.findOne({ _id: req.user.id });
            if (user.role !== 1) {
                return res.status(403).json({ errMessage: 'Admin resources access denied.' });
            }

            if (user._id == req.params._id || user.role) {
                next();
            } else {
                res.status(403).json("You're not allowed to delete other");
            }
        });
    },
};

module.exports = middlewareController;
