// // // const nodemailer = require('nodemailer');

// // // const sendEmail = async ({ email, subject, message }) => {
// // //   try {
// // //     const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
// // //     const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

// // //     const transporter = nodemailer.createTransport({
// // //       service: 'gmail',
// // //       auth: {
// // //         user: emailUser,
// // //         pass: emailPass,
// // //       },
// // //     });

// // //     const mailOptions = {
// // //       from: `"BestShop Support" <${emailUser}>`,
// // //       to: email,
// // //       subject: subject,
// // //       html: message,
// // //     };

// // //     await transporter.sendMail(mailOptions);
// // //     console.log(`Email successfully sent to ${email}`);
// // //   } catch (error) {
// // //     console.error(`Failed to send email to ${email}: ${error.message}`);
// // //   }
// // // };

// // // module.exports = sendEmail;


// // const nodemailer = require('nodemailer');

// // const sendEmail = async ({ email, subject, message }) => {
// //   try {
// //     const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
// //     const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

// //     const transporter = nodemailer.createTransport({
// //       host: 'smtp.gmail.com',
// //       port: 587,
// //       secure: false,
// //       auth: {
// //         user: emailUser,
// //         pass: emailPass,
// //       },
// //     });

// //     const mailOptions = {
// //       from: `"BestShop Support" <${emailUser}>`,
// //       to: email,
// //       subject,
// //       html: message,
// //     };

// //     await transporter.sendMail(mailOptions);

// //     console.log(`Email successfully sent to ${email}`);
// //   } catch (error) {
// //     console.error(`Failed to send email to ${email}: ${error.message}`);
// //   }
// // };

// // module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// const sendEmail = async ({ email, subject, message }) => {
//   try {
//     const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
//     const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       family: 4,
//       auth: {
//         user: emailUser,
//         pass: emailPass,
//       },
//     });

//     const mailOptions = {
//       from: `"BestShop Support" <${emailUser}>`,
//       to: email,
//       subject,
//       html: message,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(`Email successfully sent to ${email}`);
//   } catch (error) {
//     console.error(`Failed to send email to ${email}: ${error.message}`);
//   }
// };

// module.exports = sendEmail;

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BestShop <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: message,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Failed to send email');
    }

    console.log(`Email successfully sent to ${email}`);
    console.log(`Resend email ID: ${data.id}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;