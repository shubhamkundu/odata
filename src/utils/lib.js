const self = module.exports = {
    handleResponseDefault: (req, res, data) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} API response sending...`);
        res.send({
            status: 'OK',
            statusCode: 200,
            data
        });
    },

    handleAPIError: (req, res, err) => {
        console.error(`${new Date().toISOString()} ${req.method} ${req.originalUrl} API error:`, err);

        const statusCode = err.statusCode ? err.statusCode : 500;

        res
            .status(statusCode)
            .send({
                status: 'ERROR',
                statusCode,
                message: err.errorMessage
                    ? (
                        err.errorMessage.stack
                            ? err.errorMessage.stack
                            : err.errorMessage
                    )
                    : err.stack
            });
    },

    parseIntegerFrom: (val) => {
        const n = parseInt(val);
        if (!isNaN(n)) {
            return n;
        }
    },

    parseBooleanFrom: (val) => val.toLowerCase().trim() === 'true'
};