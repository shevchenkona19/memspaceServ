function errorHandler(err, req, res, next) {
    return res.status(200).json({
        message: err
    })
}

module.exports = errorHandler;