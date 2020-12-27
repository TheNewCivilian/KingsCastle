const nodemailer = require('nodemailer');
const secrets = require('./secrets.json');
const { getUnixTime } = require('./websocket/helpers');

const sendMail = (subject, body) => {
    const mailTransporter = nodemailer.createTransport({
        host: secrets.emailSmtp,
        port: secrets.emailPort,
        secure: false, // true for 465, false for other ports
        auth: {
            user: secrets.emailUsername,
            pass: secrets.emailPassword,
        },
        pool: true
    });
    mailTransporter.sendMail({
        from: '"' + secrets.emailName + '" <' + secrets.emailUsername  + '>',
        to: '"David" <david.prenninger@gmx.de>',
        subject: `Kingscastle.io - ${subject}`,
        text: body,
    });
    console.log(`${getUnixTime()} [MAIL] Mail send`);
};

module.exports = {
    sendMail,
};