import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = (to, url, txt, res) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config)

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "InventorCS Mail Support",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Email Confirmation</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    background-color: #ffffff;
                    color: #333;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    max-width: 640px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .main h2 {
                    color: #2d3748;
                }
                .main p {
                    margin-top: 8px;
                    color: #4a5568;
                }
                .button {
                    display: inline-block;
                    margin-top: 16px;
                    padding: 10px 20px;
                    font-size: 14px;
                    color: #fff;
                    background-color: #3182ce;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: background-color 0.3s;
                }
                .button:hover {
                    background-color: #2b6cb0;
                }
                .footer p {
                    margin-top: 24px;
                    color: #718096;
                }
                .footer a {
                    color: #3182ce;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <section class="container">

                <main class="main">
                    <h2>${txt}</h2>
                    <p>Tap the button below to confirm your email address. If you didn't create an account with this email, you can safely delete this email.</p>
                    <a href="${url}" class="button">Confirm Email</a>
                    <p>Thanks, <br>InventorCS team</p>
                </main>

                <footer class="footer">
                    <p>If that doesn't work, you can click the following link below:<a href="${url}">Click this link</a>.</p>
                    <p>© InventorCS. All Rights Reserved.</p>
                </footer>
            </section>
        </body>
        </html>`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return err
        return info
    })
}