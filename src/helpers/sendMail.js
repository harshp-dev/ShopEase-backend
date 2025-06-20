import mailer from '../configs/mailer.config.js';
import config from '../constants/config.js';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await mailer.sendMail({
      from: `"ShopeEase" <${config.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export default sendEmail;
