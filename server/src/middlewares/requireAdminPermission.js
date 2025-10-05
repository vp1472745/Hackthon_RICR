import Admin from '../models/adminRegisterModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Middleware to authenticate admin and check for a specific permission
export const requireAdminPermission = (permission) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
 
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminId = decoded.id || decoded.userId || decoded.user_id;
    const admin = await Admin.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    if (!admin.permissions.includes(permission)) {
      return res.status(403).json({ message: `Missing required permission: ${permission}` });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Invalid or expired token' });
  }
};
