// backend/server.js
require('dotenv').config(); // load environment variables from .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Endpoint to send SMS
app.post('/send-sms', (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'Phone and message are required' });
    }

    client.messages
        .create({
            body: message,
            from: twilioNumber, // use number from .env
            to: phone
        })
        .then(message => res.json({ success: true, sid: message.sid }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cron = require('node-cron');
const meds = require('./medications.json'); // load your medication schedule

// Schedule a check every minute
cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    meds.forEach(med => {
        if (med.time === currentTime) {
            client.messages.create({
                body: med.message,
                from: twilioNumber,
                to: med.phone
            })
            .then(msg => console.log(`Reminder sent for ${med.name}: ${msg.sid}`))
            .catch(err => console.error(`Failed to send ${med.name}:`, err.message));
        }
    });
});
