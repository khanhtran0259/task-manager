const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
      try {
            let token = req.headers.authorization;
            if (token && token.startsWith('Bearer')) {
                  token = token.split(" ")[1];
                  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                  req.user = await User.findById(decodedToken.id);
                  next();
            }
            else {
                  res.status(401).json({ message: 'No token provided' });
            }


      } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Unauthorized' });
      }
}

const adminRoleMiddleware = (req, res, next) => {
      if (req.user && req.user.role === 'admin') {
            next();
      } else {
            res.status(403).json({ message: 'Forbidden: Admins only' });
      }
}
module.exports = { authMiddleware, adminRoleMiddleware };