function errorHandler(err, req, res, next) {
    console.warn("err" + JSON.stringify(err));
    return res.status(500).json({
        message: err
    })
}

module.exports = errorHandler;