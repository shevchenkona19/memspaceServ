const AccessLevels = require("../constants/accessLevels");

function requireModer(req, res, next) {
    if (req.user.accessLvl < AccessLevels.MODER) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}

function requireAdmin(req, res, next) {
    if (req.user.accessLvl < AccessLevels.ADMIN) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}

function requireNotRegisteredUser(req, res, next) {
    if (req.user.accessLvl > AccessLevels.NOT_REGISTERED) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}

function requireSuperAdmin(req, res, next) {
    if (req.user.accessLvl < AccessLevels.SUPER_ADMIN) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}

function allButNotRegistered(req, res, next) {
    if (req.user.accessLvl === AccessLevels.NOT_REGISTERED) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}


module.exports = {
    requireAdmin,
    requireNotRegisteredUser,
    requireModer,
    requireSuperAdmin,
    allButNotRegistered
};