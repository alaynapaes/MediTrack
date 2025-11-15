require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// SMS endpoint
app.post('/send-sms', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'Phone and message are required' });
    }

    try {
        console.log(`Sending SMS to ${phone}: ${message}`);
        const msg = await client.messages.create({
            body: message,
            from: twilioNumber,
            to: phone
        });
        console.log("SMS sent! SID:", msg.sid);
        res.json({ success: true, sid: msg.sid });
    } catch (err) {
        console.error("Twilio error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email endpoint
app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ success: false, error: "Email, subject, and message are required" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message
    };

    try {
        console.log(`Sending Email to ${email} - Subject: ${subject}`);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        res.json({ success: true });
    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
