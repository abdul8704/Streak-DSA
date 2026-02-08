const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host/port from env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp, type = 'signup') => {
    try {
        const subject = type === 'signup' ? 'Verify your email' : 'Reset your password';
        const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email', error);
        return false;
    }
};

module.exports = {
    sendOTP
};
