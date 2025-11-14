window.addEventListener('DOMContentLoaded', () => {
    // Load data from localStorage
    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    let vacc = JSON.parse(localStorage.getItem("vaccines")) || [];

    console.log("Loaded meds:", meds);
    console.log("Loaded vacc:", vacc);

    function createReminderEl(item, type, index){
        const el = document.createElement('div');
        el.className = 'reminder';

        const pill = document.createElement('div');
        pill.className = 'pill';
        pill.textContent = item.name.split(' ')[0];
        pill.style.background = item.color || '';

        const body = document.createElement('div');
        body.className = 'rem-body';

        const h = document.createElement('h4');
        h.textContent = item.name + (item.dose ? (' — '+item.dose) : '');
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

<<<<<<< HEAD
    dismissBtn.addEventListener('click', () => {
    if(type === 'med') {
        // Remove from active meds
        const removedMed = meds.splice(index, 1)[0];
        localStorage.setItem('medications', JSON.stringify(meds));

        // Save to history
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history.push(removedMed);
        localStorage.setItem('history', JSON.stringify(history));

    } else if(type === 'vac') {
        // You can do the same for vaccines if you want history for them
        vacc.splice(index, 1);
        localStorage.setItem('vaccines', JSON.stringify(vacc));
    }

    render();
});


=======
        dismissBtn.addEventListener('click', () => {
            if(type === 'med') {
                meds.splice(index, 1);
                localStorage.setItem('medications', JSON.stringify(meds));
            } else if(type === 'vac') {
                vacc.splice(index, 1);
                localStorage.setItem('vaccines', JSON.stringify(vacc));
            }
            render();
        });
>>>>>>> 2b75c5769aa17a80e49ffed0aa41159df3d6c0ca

        meta.appendChild(dismissBtn);

        el.appendChild(pill);
        el.appendChild(body);
        el.appendChild(meta);

        return el;
    }

    function render(){
<<<<<<< HEAD
    const medList = document.getElementById('medList');
    if(meds.length === 0) {
        medList.innerHTML = '<div class="empty">No medications scheduled. Add one to get started </div>';
    } else {
        medList.innerHTML = '';
        meds.forEach((m, idx) => medList.appendChild(createReminderEl(m, 'med', idx)));
    }

    const vacList = document.getElementById('vaccineList');
    if(vacc.length === 0) {
        vacList.innerHTML = '<div class="empty">No vaccinations scheduled. Add one to get started </div>';
    } else {
        vacList.innerHTML = '';
        vacc.forEach((v, idx) => vacList.appendChild(createReminderEl(v, 'vac', idx)));
    }
    loadHistory();
}
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('history')) || [];

    if(!historyList) return; // skip if section missing
    historyList.innerHTML = '';

    if(history.length === 0) {
        historyList.innerHTML = '<div class="empty">No history yet.</div>';
        return;
    }

    history.forEach(med => {
        const el = document.createElement('div');
        el.className = 'reminder history-item';

        const pill = document.createElement('div');
        pill.className = 'pill';
        pill.textContent = med.name.split(' ')[0];

        const body = document.createElement('div');
        body.className = 'rem-body';
        const h = document.createElement('h4');
        h.textContent = `${med.name} — ${med.dose}`;
        const p = document.createElement('p');
        p.textContent = med.time || 'No time';
        body.appendChild(h);
        body.appendChild(p);

        el.appendChild(pill);
        el.appendChild(body);
        historyList.appendChild(el);
    });
}
=======
        const medList = document.getElementById('medList');
        const now = new Date();

        // Filter upcoming meds (time not passed yet)
        let upcomingMeds = meds.filter(m => {
            const [h, min] = m.time.split(':').map(Number);
            return (h > now.getHours()) || (h === now.getHours() && min >= now.getMinutes());
        }).sort((a,b) => {
            // latest to oldest
            return b.time.localeCompare(a.time);
        });
>>>>>>> 2b75c5769aa17a80e49ffed0aa41159df3d6c0ca

        if(upcomingMeds.length === 0) {
            medList.innerHTML = '<div class="empty">No upcoming medications. Add one to get started ✨</div>';
        } else {
            medList.innerHTML = '';
            upcomingMeds.forEach((m, idx) => medList.appendChild(createReminderEl(m, 'med', idx)));
        }

        const vacList = document.getElementById('vaccineList');

        // Filter upcoming vaccines (date not passed yet)
        let upcomingVacc = vacc.filter(v => {
            const vDate = new Date(v.date);
            vDate.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            return vDate >= today;
        }).sort((a,b) => new Date(b.date) - new Date(a.date)); // latest to oldest

        if(upcomingVacc.length === 0) {
            vacList.innerHTML = '<div class="empty">No upcoming vaccinations. Add one to get started 🌼</div>';
        } else {
            vacList.innerHTML = '';
            upcomingVacc.forEach((v, idx) => vacList.appendChild(createReminderEl(v, 'vac', idx)));
        }
    }

    render();
});
