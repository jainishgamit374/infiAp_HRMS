const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    try {
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify Your Email - AbhiProject",
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>This link will expire in 24 hours.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Could not send verification email");
    }
};

const sendBookingConfirmationEmail = async (email, name, date) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Meeting Request Received - AbhiProject",
            html: `
                <h1>Meeting Request Received</h1>
                <p>Hi ${name},</p>
                <p>We have received your request for a meeting on <strong>${new Date(date).toLocaleString()}</strong>.</p>
                <p>Our team will review it and send you a Google Meet link shortly.</p>
                <br>
                <p>Best Regards,<br>AbhiProject Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${email}`);
    } catch (error) {
        console.error("Error sending booking email:", error);
        // Don't throw error here so booking process doesn't fail if email fails
    }
};

const sendMeetingLinkEmail = async (email, name, date, link) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Meeting Confirmed - AbhiProject",
            html: `
                <h1>Meeting Confirmed</h1>
                <p>Hi ${name},</p>
                <p>Your meeting has been confirmed for <strong>${new Date(date).toLocaleString()}</strong>.</p>
                <p>You can join using the link below:</p>
                <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Join Google Meet</a>
                <p>Or copy this link: ${link}</p>
                <br>
                <p>Best Regards,<br>AbhiProject Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Meeting link email sent to ${email}`);
    } catch (error) {
        console.error("Error sending meeting link email:", error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendBookingConfirmationEmail,
    sendMeetingLinkEmail,
};
