import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'your-email@example.com',
                pass: 'your-email-password',
            },
        });
        await transporter.sendMail({
            from: '"Hackathon Team" <your-email@example.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;
