exports.roleAuthorization = (requiredRoles) => (req, res, next) => {
    try {
        const userRole = req.user?.role; // Ensure `req.user` exists

        if (!userRole || !requiredRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next(); // Proceed if the user has a required role
    } catch (err) {
        res.status(403).json({ message: 'Authorization failed' });
    }
};


