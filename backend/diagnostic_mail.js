const nodemailer = require("nodemailer");

console.log("--- Email Diagnostic Start ---");
console.log("MAIL_EMAIL exists:", !!process.env.MAIL_EMAIL);
console.log("MAIL_PASSWORD exists:", !!process.env.MAIL_PASSWORD);

const dns = require('dns');
dns.lookup('smtp.gmail.com', (err, address, family) => {
  console.log('DNS Lookup for smtp.gmail.com:', address, 'Family:', family, 'Error:', err);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP VERIFY SUCCESS: Server is ready to take our messages");
  }
});

console.log("--- Email Diagnostic End ---");
