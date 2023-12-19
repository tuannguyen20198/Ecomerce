const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async ({email, html}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Cuahangdientu 👻" <no-reply@cuahangdientu.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    html: html, // html body
  });
  return info;
});

module.exports = sendMail;
