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
        } else if (password.length < 8 {
            message.textContent = "Password must contain at least 8 characters.";
        } else if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
        } else {
            message.style.color = "green";
            message.textContent = "Form validated successfully!";
        }
    });
}