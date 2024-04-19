const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {

    //first check the request header has autharization or not
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "Token not Found" });




    // Extract the jwt token from the request header
    const token = authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: "Invalid Token" });
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    // Generate the new JWT token using user data
    return jwt.sign({userData}, process.env.JWT_SECRET,{expiresIn:30000});
}

module.exports = { jwtAuthMiddleware, generateToken };
