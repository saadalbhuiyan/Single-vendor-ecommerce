import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'saadalbhuiyan@gmail.com',             // Your Gmail address
        pass: '',                    // Your Google App Password (without spaces)
    },
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Your Company" <saadalbhuiyan@gmail.com>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

console.log('EMAIL_USER: saadalbhuiyan@gmail.com');
console.log('EMAIL_PASSWORD: *****');
