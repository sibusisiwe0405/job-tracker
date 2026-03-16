const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendStatusUpdateEmail = async (application) => {
  const msg = {
    to: process.env.FROM_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `Application Update: ${application.company} — ${application.status}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Your application for <strong>${application.role}</strong> at <strong>${application.company}</strong> has been updated.</p>
      <p>New Status: <strong>${application.status}</strong></p>
      <p>Notes: ${application.notes || 'None'}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Status email sent for ${application.company}`);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

module.exports = { sendStatusUpdateEmail };