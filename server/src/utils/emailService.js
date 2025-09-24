import nodemailer from 'nodemailer';


const sendEmail = async (to, subject, text) => {
    let transporter;

    // Try Gmail first
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        // Fallback to test account
        console.log('Gmail not configured, using test email account...');
        transporter = await createTestAccount();
        if (!transporter) {
            throw new Error('Failed to create email transporter');
        }
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html: text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);

        // For test accounts, show preview URL
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error("Error sending email:", error);


        return false;
    }
};

export const sendOTPEmail = async (to, otp) => {
    const subject = "Your FutureMaze OTP Code ";
    const text = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Your FutureMaze OTP Code</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }
                    .container { max-width: 400px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);}
                    .otp { font-size: 2em; font-weight: bold; color: #2d7ff9; letter-spacing: 4px; margin: 24px 0; }
                    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>FutureMaze Verification</h2>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please enter this code to complete your verification. This code is valid for a limited time and should not be shared with anyone.</p>
                    <div class="footer">
                        If you did not request this, please ignore this email.<br>
                        &copy; ${new Date().getFullYear()} FutureMaze
                    </div>
                </div>
            </body>
        </html>
  `;
    return sendEmail(to, subject, text);
};

export default { sendOTPEmail };