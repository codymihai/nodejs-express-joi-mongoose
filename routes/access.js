const { USER_ROLES } = require("../constants");
const jwt = require("jsonwebtoken");

class Access {

    static getTokenFromHeader = req => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    };
    static async hasAdminAccess(req, res, next) {
        const token = Access.getTokenFromHeader(req)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.user && decoded.user.role === USER_ROLES.ADMIN) {
            req.user = decoded.user
            next()
        } else {
            return res.status(401).json({success: false, error: 'unauthorized'})
        }
    }
    static async hasAccess(req, res, next) {
        const token = Access.getTokenFromHeader(req)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.user) {
            req.user = decoded.user
            next()
        } else {
            return res.status(401).json({success: false, error: 'unauthorized'})
        }
    }
}

module.exports = Access

