import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendRejectionEmail(to, { name, message }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Payment Rejected - Hackathon Registration',
    html: `<p>Dear ${name},</p><p>${message}</p><p>If you have any questions, please contact support.</p>`,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendCredentialsEmail(to, { teamCode, username, password, name, email }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Payment Verified - Hackathon Registration Credentials',
    html: `<p>Dear ${name},</p>
      <p>Your payment has been verified. Here are your credentials:</p>
      <ul>
        <li>Team Code: ${teamCode}</li>
        <li>Username: ${username}</li>
        <li>Password: ${password}</li>
        <li>Email: ${email}</li>
      </ul>
      <p>Please keep this information safe.</p>`
  };
  await transporter.sendMail(mailOptions);
}
