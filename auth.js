
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err,result) => {
            if (err)
                return res.status(401).json("Token invalid")
            req.userId = result.id
            next();
        })
    }
    else {
        return res.status(401).json("Token not found")
    }
}