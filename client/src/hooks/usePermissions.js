import { useState, useEffect } from 'react';
import { subAdminAPI } from '../configs/api';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current admin from sessionStorage
      const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
      
      if (!adminUser.email) {
        throw new Error('Admin email not found');
      }

      const response = await subAdminAPI.getAdminPermissions(adminUser.email);
      setPermissions(response.data.permissions || []);
    } catch (err) {
  
      setError(err.response?.data?.message || 'Failed to fetch permissions');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Helper function to check if user has a specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Helper function to check if user has any of the given permissions
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  // Helper function to check if user has all of the given permissions
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetchPermissions: fetchPermissions
  };
};

export default usePermissions;