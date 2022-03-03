const apiError = (messgae, code) => {
    const error = new Error(messgae);
    error.code = code;
    return error;
}

module.exports = apiError;