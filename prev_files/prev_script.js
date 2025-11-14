
function changeAboutMeText()
{
    const aboutMeText = ["Caregiver Support", "Medication Management", "Real-Time Assistance", "Elderly Care Made Easy"]
    const typingSpeed = 100;
    const eraseSpeed = 50;
    const pauseTime = 1500;
    const aboutMeElement = document.querySelector('.about-me');

    let testIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type()
    {
        const currentText = aboutMeText[testIndex];
        /*Typing*/
        if (!isDeleting && charIndex < currentText.length)
        {
            aboutMeElement.textContent+= currentText[charIndex];
            charIndex++;
            setTimeout(type, typingSpeed);
        }
        /*Erasing*/
        else if (isDeleting && charIndex>0)
        {
            aboutMeElement.textContent = currentText.substring(0, charIndex-1);
            charIndex--;
            setTimeout(type, eraseSpeed);
        }
        /*Switching between diff features*/
        else 
        {
            isDeleting=!isDeleting;
            if(!isDeleting)
            {
                testIndex = (testIndex+1) % aboutMeText.length;
            }
            setTimeout(type, pauseTime);
        }
    }
    type();
}

changeAboutMeText();