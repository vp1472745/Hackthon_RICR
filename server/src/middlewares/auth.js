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

    console.log(user);


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
    console.log("Leader authenticated");
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
    console.log('🔍 Admin Auth - Headers:', req.headers.authorization ? 'Present' : 'Missing');
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.log('❌ Admin Auth - No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    console.log('🔑 Admin Auth - Token received, verifying...');
    console.log('🔑 Admin Auth - JWT_SECRET used for verification:', JWT_SECRET);
    console.log('🔑 Admin Auth - Token to verify:', token.substring(0, 50) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('📋 Admin Auth - Decoded token:', { id: decoded.id, role: decoded.role });
    
    const adminId = decoded.id || decoded.userId || decoded.user_id;
    console.log('🔍 Admin Auth - Looking for admin ID:', adminId);
    
    // Import Admin model here to avoid circular dependency
    const { default: Admin } = await import('../models/adminRegisterModel.js');
    const admin = await Admin.findById(adminId);
    
    console.log('👤 Admin Auth - Admin found:', admin ? `${admin.email} (${admin.role})` : 'Not found');
    
    if (!admin || admin.role !== 'admin') {
      console.log('❌ Admin Auth - Access denied:', admin ? `Role: ${admin.role}` : 'Admin not found');
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    console.log('✅ Admin Auth - Success for:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.log('❌ Admin Auth - Error:', error.message);
    return res.status(401).json({ message: error.message || 'Invalid or expired token' });
  }
};

export default { authenticateToken, authenticateLeader, authenticateAdmin };