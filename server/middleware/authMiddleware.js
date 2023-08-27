require('dotenv').config();
const jwt = require('jsonwebtoken');



const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.access_header;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log(err);
                } else {
                    req.userId = decoded.id;
                    next();
                }
            });
        } else {
            res.status(401).json({ error: 'No token provided' });
        }
    } else {
        res.status(401).json({ error: 'Authorization header missing' });
    }
};

module.exports = authMiddleware;