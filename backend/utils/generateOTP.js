/**
 * Generates a random OTP (One-Time Password) of a specified length.
 * Default length is 6 digits.
 *
 * @param {number} length - The length of the OTP to generate (default is 6).
 * @returns {string} The generated OTP as a string.
 */
function generateOTP(length = 6) {
    const digits = '0123456789';  // Digits used for OTP generation
    let otp = '';

    // Generate OTP by randomly selecting digits from the available options
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
}

module.exports = generateOTP;
