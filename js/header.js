// Loads header.html into the #header-container div
function loadHeader() {
  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

       if (typeof updateStreakDisplay === "function") updateStreakDisplay();
            if (typeof updateBadge === "function") updateBadge();
    });
}

window.addEventListener("DOMContentLoaded", loadHeader);



