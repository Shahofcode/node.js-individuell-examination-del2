// Middleware for 404 errors

const notFound = (req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
};

export default notFound;
