
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (result) => {
            if (result === false)
                return res.status(401).json("Token invalid")
            const { id } = jwt.decode(token)
            req.userId = id;
            next();
        })
    }
    else {
        return res.status(401).json("Token not found")
    }
}