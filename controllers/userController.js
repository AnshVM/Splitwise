const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) console.log(err)
        bcrypt.hash(password, salt, function (err2, hash) {
            if (err2) console.log(err2)
            const user = new User({
                firstname,
                lastname,
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
                    return res.status(201).json("New user created");
                })
                .catch((err) => {
                    if (err.keyValue.username)
                        return res.status(400).json(`Account with this username already exists`)
                    if (err.keyValue.email)
                        return res.status(400).json(`Account with this email already exists`)
                })
        });
    });
}

const checkPasswordAndSendToken = async (password, user, res) => {
    bcrypt.compare(password, user.password)
        .then(async (result) => {
            if (result === false) {
                return res.status(400).json("Incorrect username,email or password");
            }
            const payload = { id: user._id };
            const accessToken = await jwt.sign(payload, process.env.SECRET_KEY)
            res.cookie('accessToken',accessToken, {httpOnly: true, secure:true, maxAge:3600000*24})
            return res.status(200).json(accessToken);
        })
}

exports.login = async (req, res) => {
    const { first, password } = req.body;
    User.findOne({ username: first })
        .then(async (user) => {
            if (!user) throw "UsernameNotFound"
            else checkPasswordAndSendToken(password, user, res)
        })
        .catch((err) => {
            if (err === "UsernameNotFound") {
                User.findOne({ email: first })
                    .then(async (user) => {
                        if (!user) throw "EmailNotFound"
                        else checkPasswordAndSendToken(password, user, res);
                    })
                    .catch((err2) => {
                        if (err2 === "EmailNotFound")
                            return res.status(400).json("Username or email address incorrect")
                    })
            }
        })
}

exports.userSearch = async (req, res) => {
    const { query } = req.params;
    const user = await User.findById(req.userId)
    User.find({ $text: { $search: query } })
        .exec(function (err, docs) {
            docs = docs.filter(doc => !doc._id.equals(user._id))
            res.json(docs)
        });
}

exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
    user.password = undefined;
    res.status(200).json(user)
}

exports.getUserByToken = async (req, res) => {
    if (req.cookies.accessToken) {
        const token = req.cookies.accessToken;
        jwt.verify(token, process.env.SECRET_KEY, async(err, result) => {
            if (err)
                return res.status(401).json("Token invalid")
            const user = await User.findById(result.id)
            if(!user) return res.status(401).json("User not found")
            res.status(200).json(token)
        })
    }
    else {
        return res.status(401).json("Token not found")
    }
}

exports.logout = (req,res) => {
    res.clearCookie('accessToken');
    res.status(200).json("Logged out")
}