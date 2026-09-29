// const nodemailer = require('nodemailer');

// const sendEmail = async ({ email, subject, message }) => {
//   try {
//     const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
//     const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: emailUser,
//         pass: emailPass,
//       },
//     });

//     const mailOptions = {
//       from: `"BestShop Support" <${emailUser}>`,
//       to: email,
//       subject: subject,
//       html: message,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Email successfully sent to ${email}`);
//   } catch (error) {
//     console.error(`Failed to send email to ${email}: ${error.message}`);
//   }
// };

// module.exports = sendEmail;


const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  try {
    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"BestShop Support" <${emailUser}>`,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = sendEmail;