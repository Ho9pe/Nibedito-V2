const nodemailer = require("nodemailer");

const { smtpEmail, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: smtpEmail,
        pass: smtpPassword,
    },
});

const emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpEmail,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.response}`);
    } catch (error) {
        console.error('Error in sending email: ', error);
        throw error;
    }
};

module.exports = { emailWithNodeMailer };