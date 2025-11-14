// Load real data from localStorage
let meds = JSON.parse(localStorage.getItem("medications")) || [];
let vacc = JSON.parse(localStorage.getItem("vaccinations")) || [];

// For debugging – see what data is loaded
console.log("Loaded meds:", meds);
console.log("Loaded vacc:", vacc);

function createReminderEl(item){
  const el = document.createElement('div'); 
  el.className='reminder';

  const pill = document.createElement('div'); 
  pill.className='pill'; 
  pill.textContent = item.name.split(' ')[0];
  pill.style.background = item.color || '';

  const body = document.createElement('div'); 
  body.className='rem-body';

  const h = document.createElement('h4'); 
  h.textContent = item.name + (item.dose ? (' — '+item.dose) : '');

  const p = document.createElement('p'); 
  p.textContent = item.time ? item.time : (item.date ? item.date : 'No time');

  body.appendChild(h); 
  body.appendChild(p);

  const meta = document.createElement('div'); 
  meta.className='rem-meta'; 
  meta.innerHTML = "<button style='border:none;background:transparent;cursor:pointer;font-weight:600'>Mark</button>";

  el.appendChild(pill); 
  el.appendChild(body); 
  el.appendChild(meta);

  return el;
}

function render(){
  // --- Medications ---
  const medList = document.getElementById('medList');

  if(meds.length === 0) {
      medList.innerHTML = '<div class="empty">No medications scheduled. Add one to get started ✨</div>';
  } else {
      medList.innerHTML = '';
      meds.forEach(m => medList.appendChild(createReminderEl(m)));
  }

  // --- Vaccinations ---
  const vacList = document.getElementById('vaccineList');

  if(vacc.length === 0) {
      vacList.innerHTML = '<div class="empty">No vaccinations scheduled. Add one to get started 🌼</div>';
  } else {
      vacList.innerHTML = '';
      vacc.forEach(v => vacList.appendChild(createReminderEl(v)));
  }

  // Optional: remove these if you don’t use the counters
  const today = document.getElemen
