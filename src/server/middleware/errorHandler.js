function errorHandler(err, req, res, next) {
    console.warn("err" + JSON.stringify(err));
    return res.status(200).json({
        success: false,
        message: err
    })
}

module.exports = errorHandler;