function updateStreakDisplay() {
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const streakEl = document.getElementById('streak');
    if (streakEl) streakEl.textContent = streak;
}

function handleMedicationDismiss() {
    const today = new Date().toISOString().split('T')[0];
    const lastTaken = localStorage.getItem('lastTakenDate');

    // already counted for today
    if (lastTaken === today) return;

    let streak = parseInt(localStorage.getItem('streak')) || 0;
    streak++;

    localStorage.setItem('lastTakenDate', today);
    localStorage.setItem('streak', streak);

    updateStreakDisplay();
    updateBadge();
}

function resetStreakIfMissed() {
    const lastTaken = localStorage.getItem('lastTakenDate');
    if (!lastTaken) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If lastTaken is NOT today and NOT yesterday → streak lost
    if (lastTaken !== today && lastTaken !== yesterday) {
        localStorage.setItem('streak', 0);
        updateStreakDisplay();
        updateBadge();
    }
}

function updateBadge() {
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const badgeEl = document.getElementById('badge');
    if (!badgeEl) return;

    let badgeName = "No Badge";

    if (streak >= 30) badgeName = "Master";
    else if (streak >= 15) badgeName = "Strong Habit";
    else if (streak >= 8) badgeName = "Dedicated";
    else if (streak >= 4) badgeName = "Consistent";
    else if (streak >= 1) badgeName = "Beginner";

    badgeEl.textContent = badgeName;
}

window.addEventListener('DOMContentLoaded', () => {
    resetStreakIfMissed();
    updateStreakDisplay();
    updateBadge();

    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];

    function createReminderEl(item, type) {
        const el = document.createElement('div');
        el.className = 'reminder';

        const pill = document.createElement('div');
        pill.className = 'pill';
        pill.textContent = item.name.split(' ')[0];
        pill.style.background = item.color || '#9ad3d6';

        const body = document.createElement('div');
        body.className = 'rem-body';

        const h = document.createElement('h4');
        h.textContent = item.name + (item.dose ? (' — ' + item.dose) : '');

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
            stopAlarm && stopAlarm();
            handleMedicationDismiss();
            updateBadge();

            // Move to history
            addToHistory(item, type);

            // Remove from list + save
            if (type === 'med') {
                meds = meds.filter(m => m !== item);
                localStorage.setItem('medications', JSON.stringify(meds));
            } else {
                vacc = vacc.filter(v => v !== item);
                localStorage.setItem('vaccines', JSON.stringify(vacc));
            }

            render();
        });

        meta.appendChild(dismissBtn);

        el.appendChild(pill);
        el.appendChild(body);
        el.appendChild(meta);

        return el;
    }

    function addToHistory(item, type) {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        history.push({
            ...item,
            type: type,
            doneAt: new Date().toISOString()
        });
        localStorage.setItem("history", JSON.stringify(history));
    }

    function updateCounts() {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const todayMedCount = meds.filter(m =>
            m.time && new Date().toISOString().split('T')[0] === todayStr
        ).length;

        const upcomingMedCount = meds.length;
        const upcomingVacCount = vacc.length;

        document.getElementById('todayCount').textContent = todayMedCount;
        document.getElementById('upcomingCount').textContent = upcomingVacCount;
    }

    function render() {
        const medList = document.getElementById('medList');
        const vacList = document.getElementById('vaccineList');

        medList.innerHTML = '';
        vacList.innerHTML = '';

        if (meds.length === 0) {
            medList.innerHTML = '<div class="empty">No upcoming medications.</div>';
        } else {
            meds.forEach(m => medList.appendChild(createReminderEl(m, 'med')));
        }

        if (vacc.length === 0) {
            vacList.innerHTML = '<div class="empty">No upcoming vaccinations.</div>';
        } else {
            vacc.forEach(v => vacList.appendChild(createReminderEl(v, 'vac')));
        }

        updateCounts();
    }

    render();
});
