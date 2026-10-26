// Assignment 5: extra JavaScript features for The Bloom.

// Keyboard navigation: focus a menu link and use left/right arrow keys.
document.querySelectorAll("nav").forEach(function(nav) {
    const links = Array.from(nav.querySelectorAll("a[href]"));
    nav.addEventListener("keydown", function(event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        const current = links.indexOf(document.activeElement);
        if (current === -1) return;
        event.preventDefault();
        const move = event.key === "ArrowRight" ? 1 : -1;
        links[(current + move + links.length) % links.length].focus();
    });
});

// Home: switch statement chooses a greeting based on the current hour.
const greeting = document.getElementById("timeGreeting");
if (greeting) {
    const hour = new Date().getHours();
    let timeOfDay;
    if (hour < 12) timeOfDay = "morning";
    else if (hour < 18) timeOfDay = "afternoon";
    else timeOfDay = "evening";

    switch (timeOfDay) {
        case "morning": greeting.textContent = "Good morning! Start your day with coffee."; break;
        case "afternoon": greeting.textContent = "Good afternoon! Time for a sweet break."; break;
        default: greeting.textContent = "Good evening! Relax at The Bloom.";
    }
}

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", function() {
        const isNight = document.body.classList.toggle("night-mode");
        themeToggle.textContent = isNight ? "Switch to Day Mode" : "Switch to Night Mode";
        themeToggle.setAttribute("aria-pressed", String(isNight));
    });
}

// About: attribute and text manipulation.
const readMore = document.getElementById("readMoreButton");
if (readMore) {
    readMore.addEventListener("click", function() {
        const extra = document.getElementById("extraStory");
        extra.hidden = !extra.hidden;
        readMore.textContent = extra.hidden ? "Read More" : "Read Less";
        readMore.setAttribute("aria-expanded", String(!extra.hidden));
    });
}

// Menu: each section becomes an object; filter() and forEach() process the array.
const menuSections = Array.from(document.querySelectorAll(".menu-category"));
const menuItems = menuSections.map(function(section) {
    return {
        category: section.dataset.category,
        element: section,
        count: section.querySelectorAll(".bloom-bootstrap-card").length,
        show: function(visible) { this.element.hidden = !visible; }
    };
});

const filters = document.querySelectorAll("#menuFilters button");
if (filters.length) {
    function filterMenu(category) {
        const shown = menuItems.filter(function(item) {
            return category === "all" || item.category === category;
        });
        menuItems.forEach(function(item) { item.show(shown.includes(item)); });
        filters.forEach(function(button) {
            const selected = button.dataset.category === category;
            button.classList.toggle("selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        let total = 0;
        for (let i = 0; i < shown.length; i++) total += shown[i].count;
        document.getElementById("menuCount").textContent = "Showing " + total + " menu items";
        shown.forEach(function(item) {
            item.element.classList.remove("menu-appear");
            void item.element.offsetWidth;
            item.element.classList.add("menu-appear");
        });
    }
    filters.forEach(function(button) {
        button.addEventListener("click", function() { filterMenu(button.dataset.category); });
    });
    filterMenu("all");
}

// Rating: select several buttons with querySelectorAll and update their text.
const stars = document.querySelectorAll("#ratingStars button");
if (stars.length) {
    stars.forEach(function(star) {
        star.addEventListener("click", function() {
            const score = Number(star.dataset.rating);
            stars.forEach(function(other) {
                const active = Number(other.dataset.rating) <= score;
                other.textContent = active ? "★" : "☆";
                other.classList.toggle("rated", active);
                other.setAttribute("aria-pressed", String(Number(other.dataset.rating) === score));
            });
            document.getElementById("ratingMessage").textContent = "Thank you! You rated us " + score + "/5.";
            playConfirmationSound();
        });
    });
}

// Sound is generated locally after a click (no external audio file needed).
function playConfirmationSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 660;
    volume.gain.setValueAtTime(0.08, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.18);
    oscillator.onended = function() { audio.close(); };
}

// Reserve: simple two-step form. showStep is called back by both buttons.
const planner = document.getElementById("visitPlanner");
if (planner) {
    const steps = planner.querySelectorAll(".planner-step");
    const next = document.getElementById("plannerNext");
    const back = document.getElementById("plannerBack");
    let stepNumber = 0;

    function showStep(number, callback) {
        stepNumber = number;
        steps.forEach(function(step, index) { step.hidden = index !== stepNumber; });
        back.hidden = stepNumber === 0;
        next.textContent = stepNumber === 0 ? "Next" : "Finish";
        document.getElementById("plannerProgress").textContent = "Step " + (stepNumber + 1) + " of 2";
        callback();
    }

    next.addEventListener("click", function() {
        if (stepNumber === 0) {
            showStep(1, function() { document.getElementById("plannerResult").textContent = ""; });
        } else {
            const visit = document.getElementById("visitType").selectedOptions[0].textContent;
            const guests = document.getElementById("visitGuests").value;
            document.getElementById("plannerResult").textContent = "Your plan: " + visit + " for " + guests + " guest(s). Please fill in the form below.";
            playConfirmationSound();
        }
    });
    back.addEventListener("click", function() {
        showStep(0, function() { document.getElementById("plannerResult").textContent = ""; });
    });
}
