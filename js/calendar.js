function getAllScheduledDates(item) {
    const dates = [];

    if (!item.startDate) return dates;

    let current = new Date(item.startDate);
    const end = new Date(); 
    end.setMonth(end.getMonth() + 3); // generate 3 months ahead

    while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);

        if (item.frequency === "daily") {
            current.setDate(current.getDate() + 1);
        } 
        else if (item.frequency === "weekly") {
            current.setDate(current.getDate() + 7);
        } 
        else {
            break;
        }
    }

    return dates;
}

function getCalendarEvents() {
    let meds = JSON.parse(localStorage.getItem("medications")) || [];
    let events = {};

    meds.forEach(item => {
        const dates = getAllScheduledDates(item);

        dates.forEach(d => {
            if (!events[d]) events[d] = [];
            events[d].push(item.name);
        });
    });

    return events;
}

function renderCalendar() {
    const events = getCalendarEvents();
    // your calendar rendering code here
}

window.addEventListener("DOMContentLoaded", renderCalendar);

