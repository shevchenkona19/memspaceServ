function requireAdmin(req, res, next) {
    
}

function requireCommonUser(req, res, next) {
    
}

function requireNotRegisteredUser(req, res, next) {
    
}

function allButNotRegistered(req, res, next) {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    next();
}


module.exports = {
    requireAdmin,
    requireCommonUser,
    requireNotRegisteredUser,
    allButNotRegistered
};