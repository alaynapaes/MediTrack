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


    function render(){
    const medList = document.getElementById('medList');
    if(meds.length === 0) {
        medList.innerHTML = '<div class="empty">No medications scheduled. Add one to get started ✨</div>';
    } else {
        medList.innerHTML = '';
        meds.forEach((m, idx) => medList.appendChild(createReminderEl(m, 'med', idx)));
    }

    const vacList = document.getElementById('vaccineList');
    if(vacc.length === 0) {
        vacList.innerHTML = '<div class="empty">No vaccinations scheduled. Add one to get started 🌼</div>';
    } else {
        vacList.innerHTML = '';
        vacc.forEach((v, idx) => vacList.appendChild(createReminderEl(v, 'vac', idx)));
    }
}


    render();
});
