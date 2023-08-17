const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const verifyJWT = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Extract the actual token value from the "Bearer" token format
        const tokenValue = token.split(" ")[1];

        const decoded = await jwt.verify(tokenValue, "secrete");
        const userId = decoded.userId;

        // Use async/await with findById instead of mixing with .then()
        const user = await User.findById(userId);

        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid Token" });
    }
};

exports.verifyJWT = verifyJWT;
