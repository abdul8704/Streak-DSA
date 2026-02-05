
const errorHandler = (err, req, res, next) => {
    // console.error(err); // Log the entire error object as requested
    if (err.response && err.response.data) {
        console.error("API Response Data:", JSON.stringify(err.response.data, null, 2));
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: err.stack,
    });

    next();
};

module.exports = errorHandler;
