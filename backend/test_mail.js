require('dotenv').config();
const transporter = require('./config/mail');

async function testMail() {
    try {
        console.log('Sending test email to', process.env.MAIL_EMAIL);
        const info = await transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to: process.env.MAIL_EMAIL,
            subject: 'Test Email from FoundU Backend',
            text: 'This is a test email to verify credentials.',
            html: '<b>This is a test email to verify credentials.</b>'
        });
        console.log('Success!', info.response);
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}

testMail();
