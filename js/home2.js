// home.js — handles UI, Dismiss button, and alarm audio
let alarmAudio; // global audio object

// Play alarm sound
export function playAlarm() {
    if (!alarmAudio) {
        alarmAudio = new Audio("alarm.mp3");
        alarmAudio.loop = true;
    }
    alarmAudio.play().catch(err => console.log("Audio error:", err));
}

// Stop alarm sound
export function stopAlarm() {
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
}

// Add item to history
function addToHistory(item, type) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({
        ...item,
        type: type,
        doneAt: new Date().toISOString()
    });
    localStorage.setItem("history", JSON.stringify(history));
}

// Create reminder HTML element
export function createReminderEl(item, type, index, meds, vacc, renderCallback) {
    const el = document.createElement('div');
    el.className = 'reminder';

    const pill = document.createElement('div');
    pill.className = 'pill';
    pill.textContent = item.name.split(' ')[0];
    pill.style.background = item.color || '';

    const body = document.createElement('div');
    body.className = 'rem-body';

    const h = document.createElement('h4');
    h.textContent = item.name + (item.dose ? ` — ${item.dose}` : '');
    const p = document.createElement('p');
    p.textContent = item.time ? item.time : (item.date ? item.date : 'No time');

    body.appendChild(h);
    body.appendChild(p);

    const meta = document.createElement('div');
    meta.className = 'rem-meta';

    const dismissBtn = document.createElement('button');
    dismissBtn.textContent = 'Dismiss';
    dismissBtn.style.cssText = `
        border: none;
        background: var(--accent-2);
        color: #222;
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    `;

    dismissBtn.addEventListener('click', () => {
        stopAlarm();
        addToHistory(item, type);

        // Remove from list
        if (type === 'med') {
            meds.splice(index, 1);
            localStorage.setItem('medications', JSON.stringify(meds));
        } else if (type === 'vac') {
            vacc.splice(index, 1);
            localStorage.setItem('vaccines', JSON.stringify(vacc));
        }

        // Refresh UI
        renderCallback();
    });

    meta.appendChild(dismissBtn);
    el.appendChild(pill);
    el.appendChild(body);
    el.appendChild(meta);

    return el;
}

// Render reminders on homepage
export function renderReminders() {
    const medList = document.getElementById('medList');
    const vacList = document.getElementById('vaccineList');

    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];

    // Render Medications
    const now = new Date();
    let upcomingMeds = meds.filter(m => {
        const [h, min] = m.time.split(':').map(Number);
        return (h > now.getHours()) || (h === now.getHours() && min >= now.getMinutes());
    }).sort((a, b) => b.time.localeCompare(a.time));

    medList.innerHTML = '';
    if (upcomingMeds.length === 0) {
        medList.innerHTML = '<div class="empty">No upcoming medications.</div>';
    } else {
        upcomingMeds.forEach((m, idx) => {
            medList.appendChild(createReminderEl(m, 'med', idx, meds, vacc, renderReminders));
        });
    }

    // Render Vaccines
    let upcomingVacc = vacc.filter(v => {
        const vDate = new Date(v.date);
        vDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return vDate >= today;
    }).sort((a,b) => new Date(b.date) - new Date(a.date));

    vacList.innerHTML = '';
    if (upcomingVacc.length === 0) {
        vacList.innerHTML = '<div class="empty">No upcoming vaccinations.</div>';
    } else {
        upcomingVacc.forEach((v, idx) => {
            vacList.appendChild(createReminderEl(v, 'vac', idx, meds, vacc, renderReminders));
        });
    }
}

// Initial render on page load
window.addEventListener('DOMContentLoaded', renderReminders);
