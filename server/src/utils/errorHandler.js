const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(400).json({ error: err.toString(), message: "Something Went Wrong. Please Try Again" });
};

export default errorHandler;