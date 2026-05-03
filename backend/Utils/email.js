const nodemailer = require('nodemailer');

const sendNomineeAlertEmail = async (userEmail, deviceInfo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🚨 VaultX Alert: Nominee Login Attempt',
    html: `
      <h3>Someone is trying to access your VaultX account as a Nominee.</h3>
      <p><strong>Device/Location:</strong> ${deviceInfo}</p>
      <p>If this is expected, please log into your VaultX dashboard to approve the request.</p>
      <p>If this is NOT you, please log in immediately and secure your account.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendNomineeAlertEmail };