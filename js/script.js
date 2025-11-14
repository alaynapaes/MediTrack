// Load reminders on home page
window.onload = function () {
    if (document.getElementById("medList")) loadMedications();
    if (document.getElementById("vaccineList")) loadVaccines();

    requestNotificationPermission();
    startReminderCheck();
};

// Save Medication
function saveMedication() {
    let meds = JSON.parse(localStorage.getItem("medications")) || [];

    meds.push({
        name: document.getElementById("medName").value,
        dose: document.getElementById("medDose").value,
        time: document.getElementById("medTime").value,
        freq: document.getElementById("medFreq").value
    });

    localStorage.setItem("medications", JSON.stringify(meds));
    alert("Medication Saved!");
    location.href = "index.html";
}

// Save Vaccine
function saveVaccine() {
    let vaccines = JSON.parse(localStorage.getItem("vaccines")) || [];

    vaccines.push({
        name: document.getElementById("vName").value,
        date: document.getElementById("vDate").value,
        notes: document.getElementById("vNotes").value
    });

    localStorage.setItem("vaccines", JSON.stringify(vaccines));
    alert("Vaccination Saved!");
    location.href = "index.html";
}

// Load Medications
function loadMedications() {
    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    let container = document.getElementById("medList");
    container.innerHTML = "";

    meds.forEach(m => {
        container.innerHTML += `<div>${m.name} - ${m.dose} - ${m.time} - ${m.freq}</div>`;
    });
}

// Load Vaccines
function loadVaccines() {
    let vaccines = JSON.parse(localStorage.getItem("vaccines")) || [];
    let container = document.getElementById("vaccineList");
    container.innerHTML = "";

    vaccines.forEach(v => {
        container.innerHTML += `<div>${v.name} - ${v.date} - ${v.notes}</div>`;
    });
}

// --------- Notifications ---------

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

function startReminderCheck() {
    setInterval(() => {
        let now = new Date();
        let currentTime = now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');

        let meds = JSON.parse(localStorage.getItem("medications")) || [];
        meds.forEach(m => {
            if (m.time === currentTime) {
                sendNotification("Medicine Reminder", `Time to take: ${m.name} (${m.dose})`);
            }
        });
    }, 60000); // checks every minute
}