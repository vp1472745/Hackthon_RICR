import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export const sendOTPEmail = async (to, otp) => {
    const subject = "Your Nav Kalpana OTP Code ";
    const text = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Your Nav Kalpana OTP Code</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }
                    .container { max-width: 400px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);}
                    .otp { font-size: 2em; font-weight: bold; color: #2d7ff9; letter-spacing: 4px; margin: 24px 0; }
                    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Nav Kalpana Verification</h2>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please enter this code to complete your verification. This code is valid for a limited time and should not be shared with anyone.</p>
                    <div class="footer">
                        If you did not request this, please ignore this email.<br>
                        &copy; ${new Date().getFullYear()} Nav Kalpana
                    </div>
                </div>
            </body>
        </html>
  `;
    return sendEmail(to, subject, text);
};


export const sendCredentialsEmail = async (to, credentials) => {
    const subject = "Your Nav Kalpana Login Credentials";
    const email = to;
    const text = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Your Nav Kalpana Login Credentials</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }
                    .container { max-width: 400px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);}
                    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Your Nav Kalpana Login Credentials</h2>
                    <p>Hello,</p>
                    <p>Your login credentials are as follows:</p>
                    <p><strong>Team Code:</strong> ${credentials.teamCode}</p>
                    <p><strong>Email:</strong> ${credentials.email}</p>
                    <p>Please keep this information safe and do not share it with anyone.</p>
                    <div class="footer">
                        If you did not request this, please ignore this email.<br>
                        &copy; ${new Date().getFullYear()} Nav Kalpana
                    </div>
                </div>
            </body>
        </html>
    `;
    return sendEmail(to, subject, text);
};


export const sendRejectionEmail = async (to, data) => {
    const subject = "Nav Kalpana - Payment Rejected";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Payment Rejected</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }
                .container { max-width: 400px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 8px; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                .footer { font-size: 0.85em; color: #888; margin-top: 32px; }
                .reason { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Payment Rejected</h2>
                <p>Hello ${data.name},</p>

                <p>We reviewed the payment information you submitted, but your UPI Transaction ID could not be verified.</p>

                <p class="reason">
                    Reason: ${data.message}
                </p>

                <p>
                    Therefore, your registration has been <strong>blocked</strong> for now.  
                    If you believe this is a mistake or if you have valid proof of payment,  
                    please contact our support team immediately.
                </p>

                <div class="footer">
                    &copy; ${new Date().getFullYear()} Nav Kalpana
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(to, subject, html);
};


export async function sendPaymentSubmissionEmail(to, { teamId, name, email, phone, referenceId, transactionId, screenshotUrl }) {
  const subject = "New Payment Submission";
  const html = `
    <h2>New Payment Submitted</h2>
    <p><strong>Team ID:</strong> ${teamId}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Reference ID:</strong> ${referenceId}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    ${screenshotUrl ? `<p><strong>Screenshot:</strong> <a href="${screenshotUrl}">View</a></p>` : ""}
  `;
  return sendEmail(to, subject, html);
}