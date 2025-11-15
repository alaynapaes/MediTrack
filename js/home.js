window.addEventListener('DOMContentLoaded', () => {
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

            // Move to history
            addToHistory(item, type);

            if(type === 'med') {
                meds.splice(index, 1);
                localStorage.setItem('medications', JSON.stringify(meds));
            } else if(type === 'vac') {
                vacc.splice(index, 1);
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

        const todayMedCount = meds.filter(m => m.time && new Date().toISOString().split('T')[0] === todayStr).length;
        const upcomingMedCount = meds.length;
        const upcomingVacCount = vacc.length;

        document.getElementById('todayCount').textContent = todayMedCount;
        document.getElementById('upcomingCount').textContent = upcomingMedCount + upcomingVacCount;
    }

    function render() {
        const medList = document.getElementById('medList');
        let upcomingMeds = meds.filter(m => {
            const start = new Date(m.startDate);
            const end = new Date(m.endDate);
            const [h, min] = m.time.split(':').map(Number);
            return now >= start && now <= end && (h > now.getHours() || (h === now.getHours() && min >= now.getMinutes()));
        }).sort((a,b) => b.time.localeCompare(a.time));

        medList.innerHTML = upcomingMeds.length ? '' : '<div class="empty">No upcoming medications.</div>';
        upcomingMeds.forEach((m, idx) => medList.appendChild(createReminderEl(m, 'med', idx)));

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
