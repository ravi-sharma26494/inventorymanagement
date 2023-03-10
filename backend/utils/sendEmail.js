const nodemailer = require('nodemailer');

const sendEmail = async(subject, message, send_to, sent_from, reply_to) => {
    //create Email Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service:"outlook",
        secureConnection:false,
        port: 587,
        // secureConnection:true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            ciphers: "SSLv3"
        }
    });


    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message

    }

    //send the email
     transporter.sendMail(options, function (err, info){
        if(err){
            console.log(err);
        }
        else{

            console.log(info)
        }
     });
};

module.exports = sendEmail;