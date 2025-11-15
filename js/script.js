window.onload = function () {
    requestNotificationPermission();
    startReminderCheck();
};

let alarmAudio;
function playAlarm() {
    alarmAudio = new Audio("alarm.mp3");
    alarmAudio.loop = true;
    alarmAudio.play().catch(err => console.log("Audio error:", err));
}
function stopAlarm() {
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
}

// Save Medication with duration/endDate
function saveMedication() {
    const name = document.getElementById('medName').value.trim();
    const dose = document.getElementById('medDose').value.trim();
    const time = document.getElementById('medTime').value.trim();
    const frequency = document.getElementById('medFreq').value.trim();
    const duration = parseInt(document.getElementById('medDuration').value.trim());

    if (!name || !dose || !time || !frequency || !duration) {
        alert("Please fill all fields including duration.");
        return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    meds.push({ name, dose, time, frequency, startDate: startDate.toISOString(), endDate: endDate.toISOString(), color: "" });
    localStorage.setItem("medications", JSON.stringify(meds));

    alert("Medication saved!");
    window.location.href = "index.html";
}

// Save Vaccine with optional endDate
function saveVaccine() {
    const name = document.getElementById('vName').value.trim();
    const date = document.getElementById('vDate').value.trim();
    const notes = document.getElementById('vNotes').value.trim();

    if (!name || !date) {
        alert("Please enter Vaccine Name and Date.");
        return;
    }

    let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
    vacc.push({ name, date, notes, startDate: date, endDate: date }); // single-day reminder
    localStorage.setItem("vaccines", JSON.stringify(vacc));

    alert("Vaccination saved!");
    window.location.href = "index.html";
}

// Notifications
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, { body });
        notification.onclick = () => stopAlarm();
        notification.onclose = () => stopAlarm();
    }
}

function sendSMS(message) {
    localStorage.setItem("smsEnabled", "true");
    const phone = "+917758047172";
    console.log("Sending SMS:", message);
    fetch("http://localhost:3000/send-sms", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({phone,message}) })
    .then(res => console.log("SMS sent"))
    .catch(err => console.error("SMS error:", err));
}

function sendEmailNotification(subject, message) {
    const email = "user-email@example.com";
    console.log("Sending Email:", subject, message);
    fetch("http://localhost:3000/send-email", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({email, subject, message}) })
    .then(res => console.log("Email sent"))
    .catch(err => console.error("Email error:", err));
}

// Reminder check
function startReminderCheck() {
    function checkReminders() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

        let meds = JSON.parse(localStorage.getItem("medications")) || [];
        meds.forEach(m => {
            const start = new Date(m.startDate);
            const end = new Date(m.endDate);
            const [h, min] = m.time.split(':').map(Number);
            if (now >= start && now <= end && now.getHours() === h && now.getMinutes() === min) {
                const msg = `Time to take: ${m.name} (${m.dose})`;
                sendNotification("Medicine Reminder", msg);
                sendSMS(msg);
                sendEmailNotification("Medicine Reminder", msg);
                playAlarm();
            }
        });

        let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
        vacc.forEach(v => {
            const today = new Date();
            const vDate = new Date(v.date);
            vDate.setDate(vDate.getDate() - 1); // remind one day before
            if (today.getFullYear()===vDate.getFullYear() && today.getMonth()===vDate.getMonth() && today.getDate()===vDate.getDate()) {
                const msg = `Vaccine Reminder: ${v.name} tomorrow`;
                sendNotification("Vaccine Reminder", msg);
                sendSMS(msg);
                sendEmailNotification("Vaccine Reminder", msg);
                playAlarm();
            }
        });
    }

    checkReminders();
    setInterval(checkReminders, 60000);
}
