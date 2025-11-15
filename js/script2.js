// script.js — handles checking reminders, notifications, SMS, email
import { playAlarm } from './home.js';

// Request notification permission immediately
window.onload = function () {
    requestNotificationPermission();
    startReminderCheck();
};

// Notifications
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, { body });
        notification.onclick = () => {}; // optional
    }
}

// SMS
function sendSMS(message) {
    const smsEnabled = localStorage.getItem("smsEnabled") === "true";
    if (!smsEnabled) return;

    const phone = "+917758047172";

    fetch("http://localhost:3000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message })
    }).then(res => console.log("SMS sent"))
      .catch(err => console.error("SMS error:", err));
}

// Email
function sendEmailNotification(subject, message) {
    const email = "user-email@example.com"; // Replace with user's email

    fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message })
    })
    .then(res => console.log("Email sent"))
    .catch(err => console.error("Email error:", err));
}

// Check reminders every minute
export function startReminderCheck() {
    function checkReminders() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

        // Medications
        const meds = JSON.parse(localStorage.getItem("medications")) || [];
        meds.forEach(m => {
            if (m.time === currentTime) {
                const msg = `Time to take: ${m.name} (${m.dose})`;
                sendNotification("Medicine Reminder", msg);
                sendSMS(msg);
                sendEmailNotification("Medicine Reminder", msg);
                playAlarm();
            }
        });

        // Vaccines (remind 1 day before)
        const vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
        vacc.forEach(v => {
            const today = new Date();
            const vaccineDate = new Date(v.date);
            vaccineDate.setDate(vaccineDate.getDate() - 1); // day before

            if (today.getFullYear() === vaccineDate.getFullYear() &&
                today.getMonth() === vaccineDate.getMonth() &&
                today.getDate() === vaccineDate.getDate()
            ) {
                const msg = `Vaccine Reminder: ${v.name} tomorrow`;
                sendNotification("Vaccine Reminder", msg);
                sendSMS(msg);
                sendEmailNotification("Vaccine Reminder", msg);
                playAlarm();
            }
        });
    }

    // Check immediately and then every minute
    checkReminders();
    setInterval(checkReminders, 60000);
}
