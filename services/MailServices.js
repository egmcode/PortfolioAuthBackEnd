import nodemailer from 'nodemailer';
import nodemailMailgun from 'nodemailer-mailgun-transport';
import UserServices from './UserServices.js';

class mailgun
{
    static mailsvc(email, username)
    {
        const auth = {
            auth: {
                api_key: process.env.APIKEY,
                domain: 'egmcodes.com'
            }
        };

        let transporter = nodemailer.createTransport(nodemailMailgun(auth));
        let link = "https://egmcodes.com/resetpassword/";
        let token = UserServices.genToken(username);

        const mailOptions = {
            from: 'EGMCode DoNotReply <egmcode@email.egmcodes.com>',
            to: email,
            subject: 'Password Reset',
            text: 'Password Reset Link: ' + link + token
        };

        try
        {
            transporter.sendMail(mailOptions);
        }
        catch{}
    }
}

export default mailgun;