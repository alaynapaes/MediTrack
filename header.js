// This loads header.html into the #header div
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.getElementById("navLinks");
    if(menuIcon && navLinks){
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  })
  .catch(error => console.error('Error loading header:', error));