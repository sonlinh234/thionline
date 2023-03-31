const nodemailer = require("nodemailer");
var config = require('config');

let transporter = nodemailer.createTransport({
    host: config.get('smtp.host'),
    port: config.get('smtp.port'),
    secure: true,
    auth: {
        user: config.get('mail-credentials.userid'),
        pass: config.get('mail-credentials.password')
    }
});

let sendmail = (toid,sub,text,html)=>{
    return transporter.sendMail({
        from: config.get('mail-sender.from'),
        to: toid,
        subject: sub,
        text: text,
        html: html || null
    });
}

module.exports = {sendmail}