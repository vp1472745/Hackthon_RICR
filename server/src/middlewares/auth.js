import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const error = new Error('Access token required');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    const userId = decoded.userId || decoded.user_id; // Handle both possible field names
    const user = await User.findById(userId).populate('teamId');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    } else if (error.name === 'TokenExpiredError') {
      error.message = 'Token expired';
      error.statusCode = 401;
    }
    next(error);
  }
};


export const authenticateLeader = async (req, res, next) => {
  try {
    // First authenticate the token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const error = new Error('Access token required');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    const userId = decoded.userId || decoded.user_id; // Handle both possible field names
    const user = await User.findById(userId).populate('teamId');



    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    // Check if user is a leader
    if (user.role !== 'Leader') {
      const error = new Error('Leader access required');
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    } else if (error.name === 'TokenExpiredError') {
      error.message = 'Token expired';
      error.statusCode = 401;
    }
    next(error);
  }
};







// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }



    const decoded = jwt.verify(token, JWT_SECRET);
    
    const adminId = decoded.id || decoded.userId || decoded.user_id;
    
    // Import Admin model here to avoid circular dependency
    const { default: Admin } = await import('../models/adminRegisterModel.js');
    const admin = await Admin.findById(adminId);
    
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
   
    req.admin = admin;
    next();
  } catch (error) {
  
    return res.status(401).json({ message: error.message || 'Invalid or expired token' });
  }
};

export default { authenticateToken, authenticateLeader, authenticateAdmin };