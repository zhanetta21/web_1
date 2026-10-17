alert("JavaScript connected!");
const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
    reservationForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("guest-name").value.trim();
        const email = document.getElementById("guest-email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("formMessage");

        message.style.color = "red";

        if (!reservationForm.checkValidity()) {
            message.textContent = "Please complete all required fields correctly.";
            return;
        }

        if (name.length < 2) {
            message.textContent = "Name must contain at least 2 characters.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.textContent = "Please enter a valid email address.";
        } else if (password.length < 8 ){
            message.textContent = "Password must contain at least 8 characters.";
        } else if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
        } else {
            message.style.color = "green";
            message.textContent = "Form validated successfully!";
        }
    });
}

// TASK 2 - ACCORDION

const questions = document.querySelectorAll(".faq-question");

questions.forEach(function(question) {
    question.addEventListener("click", function() {
        const answer = question.nextElementSibling;
        answer.classList.toggle("active");
    });
});
// TASK 3 - POPUP FORM

const popup = document.getElementById("popup");
const openPopup = document.getElementById("openPopup");
const closePopup = document.getElementById("closePopup");

if (popup && openPopup && closePopup) {
    openPopup.addEventListener("click", function() {
        popup.style.display = "flex";
    });

    closePopup.addEventListener("click", function() {
        popup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
}

const subscribeForm = document.getElementById("subscribeForm");

if (subscribeForm) {
    subscribeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("subscribeMessage").textContent =
            "Thank you for subscribing!";
        subscribeForm.reset();
    });
}

// TASK 4 - BACKGROUND COLOR

const colorButton = document.getElementById("changeColor");

if (colorButton) {
    const colors = ["#fff8f0", "#f5e9e4", "#e8f3e8", "#e8eef8"];
    let colorIndex = 0;

    colorButton.addEventListener("click", function() {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
}
// TASK 5 - DATE AND TIME

const dateTimeElement = document.getElementById("dateTime");

function updateDateTime() {
    if (dateTimeElement) {
        const now = new Date();

        dateTimeElement.textContent = now.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
}

if (dateTimeElement) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}