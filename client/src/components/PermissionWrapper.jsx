import React from 'react';
import usePermissions from '../hooks/usePermissions';

const PermissionWrapper = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null,
  showError = false 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Multiple permissions check
    hasAccess = requireAll 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  } else {
    // No permission specified, assume access granted
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // No access - show fallback or error message
  if (showError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center text-red-600 mb-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Access Denied
        </div>
        <p className="text-red-700 text-sm">
          You don't have permission to access this feature. Contact your administrator for access.
        </p>
      </div>
    );
  }

  return fallback;
};

export default PermissionWrapper;