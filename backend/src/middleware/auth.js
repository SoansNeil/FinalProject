// Removed JWT verification

export const protect = (req, res, next) => {
  try {
    // No token-based authentication. Allow all requests for now.
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};
