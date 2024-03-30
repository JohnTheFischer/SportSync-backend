const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchAdmin = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.get('adminToken');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
        return;
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data)
        req.admin = data.admin;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
        return;
    }

}


module.exports = fetchAdmin; 