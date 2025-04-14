const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1]

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)

                // Get user from token
                const user = await User.findById(decoded.id).select('-password')

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                // Add user to request object
                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, token failed'
                });
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
}

module.exports = { protect } 
