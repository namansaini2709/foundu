import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserId, getUserType } from '../utils/authUtils';

/**
 * ProtectedRoute Component
 * @param {Element} children - The component to render if authorized
 * @param {string} allowedRole - (Optional) The specific role required (e.g., 'founder', 'freelancer', 'admin')
 */
const ProtectedRoute = ({ children, allowedRole }) => {
    const location = useLocation();
    const userId = getUserId();
    const userRole = getUserType();

    // 1. Check if user is logged in
    if (!userId) {
        // Redirect to login if not authenticated
        // We save the current location to redirect back after login
        return <Navigate to="/login-signup" state={{ from: location }} replace />;
    }

    // 2. Check for role-based access if allowedRole is provided
    if (allowedRole && userRole !== allowedRole) {
        // If they have the wrong role (e.g., freelancer trying to see founder dashboard)
        // Redirect them to their own correct dashboard or home
        if (userRole === 'founder') return <Navigate to="/startup-dashboard" replace />;
        if (userRole === 'freelancer') return <Navigate to="/freelancer-dashboard" replace />;
        if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
        
        return <Navigate to="/" replace />;
    }

    // 3. Authorized
    return children;
};

export default ProtectedRoute;
