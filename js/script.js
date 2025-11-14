// Request permission immediately
window.onload = function () {
    requestNotificationPermission();
    startReminderCheck();
};

// Save Medication
function saveMedication() {
    const name = document.getElementById('medName').value.trim();
    const dose = document.getElementById('medDose').value.trim();
    const time = document.getElementById('medTime').value.trim();
    const frequency = document.getElementById('medFreq').value.trim();

    if (!name || !dose || !time || !frequency) {
        alert("Please fill in all fields: Name, Dosage, Time, and Frequency.");
        return;
    }

    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    meds.push({ name, dose, time, frequency, color: "" });
    localStorage.setItem("medications", JSON.stringify(meds));

    alert("Medication saved successfully!");
    window.location.href = "index.html";
}

// Save Vaccine
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

// Notifications
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

function sendSMS(message) {
    // Replace with actual user phone
    const phone = "+917758047172";

    fetch("http://localhost:3000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message })
    }).then(res => console.log("SMS sent"))
      .catch(err => console.error("SMS error:", err));
}

function startReminderCheck() {
    function checkReminders() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2,'0');
        const minutes = String(now.getMinutes()).padStart(2,'0');
        const currentTime = `${hours}:${minutes}`;

        let meds = JSON.parse(localStorage.getItem("medications")) || [];
        meds.forEach(m => {
            if (m.time === currentTime) {
                sendNotification("Medicine Reminder", `Time to take: ${m.name} (${m.dose})`);
            }
        });

        let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];
        vacc.forEach(v => {
            const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
            if (v.date === today) {
                sendNotification("Vaccine Reminder", `Today: ${v.name}`);
            }
        });
    }

    // check immediately and then every minute
    checkReminders();
    setInterval(checkReminders, 60000);
}
