/**
 * JWT configuration for signing and expiration.
 * Secret and expiration time are loaded from environment variables,
 * with sensible defaults for development.
 */
module.exports = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
