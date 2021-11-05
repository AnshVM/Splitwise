const User = require('../models/User')
const bcrypt = require('bcryptjs')


exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            const user = new User({
                username,
                email,
                password: hash,
                followers: [],
                following: [],
                posts: [],
                joinedAt: new Date(),
            })

            user.save()
                .then((user) => {
                    return res.status(201).json(user._id);
                })
                .catch((err) => {
                    if (err.errors.username)
                        return res.status(400).json(`Account with this username already exists`)
                    if (err.errors.email)
                        return res.status(400).json(`Account with this email already exists`)
                })
        });
    });
}

exports.login = async (req, res) => {
    const { first, password } = req.body;
    User.findOne({ username: first })
        .then(async (user) => {
            if (!user) throw "UsernameNotFound"
            res.status(200).json(user)
        })
        .catch((err) => {
            if (err === "UsernameNotFound") {
                User.findOne({ email: first })
                    .then(async (user) => {
                        if (!user) throw "EmailNotFound"
                        res.status(200).json(user)
                    })
                    .catch((err2) => {
                        if (err2 === "EmailNotFound")
                            return res.status(400).json("Username or email address incorrect")
                    })
            }
        })
}