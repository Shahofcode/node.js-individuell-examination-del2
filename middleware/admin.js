export default (req, res, next) => {
    if (global.currentUser && global.currentUser?.isAdmin === true) {
        req.user = global.currentUser;
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized request, please log in to an admin account.",
            status: 401,
        });
    }
};