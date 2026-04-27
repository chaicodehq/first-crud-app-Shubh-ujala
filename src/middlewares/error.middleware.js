/**
 * TODO: Handle errors
 *
 * Required error format: { error: { message: "..." } }
 *
 * Handle these cases:
 * 1. Mongoose ValidationError → 400 with combined error messages
 * 2. Mongoose CastError → 400 with "Invalid id format"
 * 3. Other errors → Use err.status (or 500) and err.message
 */
export function errorHandler(err, req, res, next) {
  // Your code here
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: {
        message: messages.join(", "),
      },
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      error: {
        message: "Invalid id format",
      },
    });
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({
    error: {
      message,
    },
  });
}
