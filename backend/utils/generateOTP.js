/**
 * Generate a numeric OTP of specified length.
 * Default length is 6 digits.
 *
 * @param {number} length - Length of the OTP to generate.
 * @returns {string} Numeric OTP string.
 */
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        // Pick a random digit and append to OTP string
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
}

module.exports = generateOTP;
