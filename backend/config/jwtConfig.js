/**
 * JWT configuration settings.
 *
 * - secret: Secret key used to sign JWT tokens.
 * - expiresIn: Token expiration duration.
 *
 * Values are sourced from environment variables with
 * fallback defaults for development purposes.
 */

module.exports = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
