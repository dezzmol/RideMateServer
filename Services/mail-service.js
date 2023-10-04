const nodemail = require("nodemailer")

class MailService {
    constructor() {
        this.transporter = nodemail.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
        console.log(this.transporter);
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Activate acc to " + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Click to the link for activation</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async getAccessToken() {
        return new Promise((resolve, reject) => {
            oAuth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}

module.exports = new MailService()