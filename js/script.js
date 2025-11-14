// Load reminders on home page
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

    // Validate required fields
    if (!name || !dose || !time || !frequency) {
        alert("Please fill in all fields: Name, Dosage, Time, and Frequency.");
        return; // Stop saving if any field is empty
    }

    // Get existing medications from localStorage
    let meds = JSON.parse(localStorage.getItem("medications")) || [];

    // Create medication object
    const medication = {
        name: name,
        dose: dose,
        time: time,
        frequency: frequency,
        color: "" // optional
    };

    // Save to localStorage
    meds.push(medication);
    localStorage.setItem("medications", JSON.stringify(meds));

    alert("Medication saved successfully!");
    window.location.href = "index.html"; // redirect back to home page
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

    const vaccine = {
        name: name,
        date: date,
        notes: notes
    };

    vacc.push(vaccine);
    localStorage.setItem("vaccines", JSON.stringify(vacc));

    alert("Vaccination saved!");
    window.location.href = "index.html";
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
        container.innerHTML += `<div>${v.name} - ${v.date} - ${v.dose}</div>`;
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