







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

        dismissBtn.addEventListener('click', () => {
            stopAlarm();
    // 1. MOVE TO HISTORY
    addToHistory(item, type);

    // 2. REMOVE FROM CURRENT LIST
    if(type === 'med') {
        meds.splice(index, 1);
        localStorage.setItem('medications', JSON.stringify(meds));
    } else if(type === 'vac') {
        vacc.splice(index, 1);
        localStorage.setItem('vaccines', JSON.stringify(vacc));
    }

    // 3. REFRESH UI
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

    function render(){
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

        if(upcomingMeds.length === 0) {
            medList.innerHTML = '<div class="empty">No upcoming medications.</div>';
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
            vacList.innerHTML = '<div class="empty">No upcoming vaccinations.</div>';
        } else {
            vacList.innerHTML = '';
            upcomingVacc.forEach((v, idx) => vacList.appendChild(createReminderEl(v, 'vac', idx)));
        }
    }
    


    render();
});
