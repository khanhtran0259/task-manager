const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
      }
});

const sendInviteEmail = async (to, link) => {
      await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: 'You are invited to register!',
            html: `<p>Click below to register:</p><a href="${link}">${link}</a>`
      });
};

async function sendLoginCodeEmail(to, code) {
      const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject: 'Your login code',
            text: `Your login code is: ${code}`
      };
      await transporter.sendMail(mailOptions);
}

module.exports = { sendInviteEmail, sendLoginCodeEmail };
