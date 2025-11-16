
window.onload = function () {
    requestNotificationPermission();
    startReminderCheck();
    resetStreakIfMissed();
    updateStreakDisplay();
    updateBadge();
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

function saveMedication() {
    const name = document.getElementById('medName').value.trim();
    const dose = document.getElementById('medDose').value.trim();
    const time = document.getElementById('medTime').value.trim();
    const frequency = document.getElementById('medFreq').value.trim();
    const duration = parseInt(document.getElementById('medDuration').value) || 30;
    const notes = document.getElementById('medNotes').value.trim();
    const today = new Date().toISOString().split('T')[0]; // e.g. "2025-11-15"

    if (!name || !dose || !time || !frequency) {
        alert("Please fill all fields: Name, Dosage, Time, Frequency.");
        return;
    }

    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    meds.push({
        name,
        dose,
        time,
        frequency,
        duration,     // number of days to recur
        notes,        // optional notes
        startDate: today,  // first day of medication
        color: '#9ad3d6'
    });
    localStorage.setItem("medications", JSON.stringify(meds));

    alert("Medication saved!");
    window.location.href = "index.html";
}


function saveVaccine() {
    const name = document.getElementById('vName').value.trim();
    const date = document.getElementById('vDate').value.trim();
    const notes = document.getElementById('vNotes').value.trim();

    if (!name || !date) {
        alert("Please enter Vaccine Name and Date.");
        return;
    }

    let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
    vacc.push({ name, date, notes });
    localStorage.setItem("vaccines", JSON.stringify(vacc));

    alert("Vaccination saved!");
    window.location.href = "index.html";
}

 
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        const notif = new Notification(title, { body });

        notif.onclick = () => stopAlarm();
        notif.onclose = () => stopAlarm();
    }
}


function sendSMS(message) {
    localStorage.setItem("smsEnabled", "true");

    const phone = "+917758047172";
    console.log("Sending SMS:", message);

    fetch("http://localhost:3000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message })
    })
        .then(() => console.log("SMS sent"))
        .catch(err => console.error("SMS error:", err));
}

function sendEmailNotification(subject, message) {
    const email = "user-email@example.com";

    fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message })
    })
        .then(() => console.log("Email sent"))
        .catch(err => console.error("Email error:", err));
}


function startReminderCheck() {
    function checkReminders() {
        const now = new Date();
        const hr = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hr}:${min}`;

        // MEDICATION REMINDERS
        let meds = JSON.parse(localStorage.getItem("medications")) || [];
        meds.forEach(m => {
            if (m.time === currentTime) {
                const msg = `Time to take: ${m.name} (${m.dose})`;
                sendNotification("Medicine Reminder", msg);
                sendSMS(msg);
                sendEmailNotification("Medicine Reminder", msg);
                playAlarm();
            }
        });

        // VACCINE REMINDERS (one day before)
        let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
        vacc.forEach(v => {
            const today = new Date();
            const vaccineDate = new Date(v.date);
            vaccineDate.setDate(vaccineDate.getDate() - 1);

            if (
                today.getFullYear() === vaccineDate.getFullYear() &&
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

    checkReminders();
    setInterval(checkReminders, 60000);
}


function handleMedicationDismiss() {
    stopAlarm();

    const today = new Date().toISOString().split("T")[0];
    const lastTaken = localStorage.getItem("lastTakenDate");

    // Already counted today
    if (lastTaken === today) {
        updateStreakDisplay();
        updateBadge();
        return;
    }

    // Increase streak
    let streak = parseInt(localStorage.getItem("streak")) || 0;
    streak++;

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastTakenDate", today);

    updateStreakDisplay();
    updateBadge();
}

// Reset if missed yesterday & today
function resetStreakIfMissed() {
    const lastTaken = localStorage.getItem("lastTakenDate");
    if (!lastTaken) return;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (lastTaken !== today && lastTaken !== yesterday) {
        localStorage.setItem("streak", 0);
    }
}


function updateStreakDisplay() {
    const streak = parseInt(localStorage.getItem("streak")) || 0;
    const el = document.getElementById("streak");
    if (el) el.textContent = streak;
}


function updateBadge() {
    const streak = parseInt(localStorage.getItem("streak")) || 0;
    const badgeEl = document.getElementById("badge");
    if (!badgeEl) return;

    let badgeName = "No Badge";

    if (streak >= 30) badgeName = "Master";
    else if (streak >= 15) badgeName = "Strong Habit";
    else if (streak >= 8) badgeName = "Dedicated";
    else if (streak >= 4) badgeName = "Consistent";
    else if (streak >= 1) badgeName = "Beginner";

    badgeEl.textContent = badgeName;
}
