// Loads header.html into the #header-container div
function loadHeader() {
  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
    });
}

window.addEventListener("DOMContentLoaded", loadHeader);
