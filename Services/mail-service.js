const nodemail = require("nodemailer")

class MailService {
    constructor() {
        this.transporter = nodemail.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
        console.log(this.transporter)
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Activate acc to " + process.env.API_URL,
            text: "",
            html: `
                    <div>
                        <h1>Click to the link for activation</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
        })
    }

    async sendEmailChangeMail(to, userName, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Email change",
            text: "",
            html: `
                <div>
                    <h1>Hello ${userName},</h1>
                    <b>you have requested a mail change. Here is your code to verify your identity:</b>
                    <b>${code}</b>
                </div>
            `,
        })
    }

    async sendPasswordChangeMail(to, userName, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Password change",
            text: "",
            html: `
                <div>
                    <h1>Hello ${userName},</h1>
                    <b>you have requested a password change. Here is your code to verify your identity:</b>
                    <b>${code}</b>
                </div>
            `,
        })
    }

    async getAccessToken() {
        return new Promise((resolve, reject) => {
            oAuth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(token)
                }
            })
        })
    }
}

module.exports = new MailService()
