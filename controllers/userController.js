const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        if(err) console.log(err)
        bcrypt.hash(password, salt, function (err2, hash) {
            if(err2) console.log(err2)
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
                        console.log("User: " + JSON.stringify(user))
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

exports.userSearch = (req,res) => {
    const {query} = req.params;
    console.log(query)
    User.find({$text: {$search: query}})
       .exec(function(err, docs) {
        res.json(docs)
    });
}

exports.getUserById = async (req,res) => {
    const user = await User.findById(req.params.id)
    user.password = undefined;
    res.status(200).json(user)
}