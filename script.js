const themeToggle = document.querySelector("#theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const messageInput = document.querySelector("#message");
const messageCount = document.querySelector("#message-count");
const skillFilters = document.querySelectorAll(".skill-filter");
const skillItems = document.querySelectorAll("[data-skill-category]");
const skillHeadings = document.querySelectorAll("[data-skill-heading]");

function setTheme(theme, savePreference = false) {
    const isLight = theme === "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    themeToggle.textContent = isLight ? "Use dark theme" : "Use light theme";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeColor.setAttribute("content", isLight ? "#f8f2fc" : "#100b18");

    if (savePreference) {
        try {
            localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        } catch (error) {
            console.warn("Could not save the theme preference.", error);
        }
    }
}

function getFieldError(field) {
    const value = field.value.trim();

    if (!value) {
        return "This field is required.";
    }

    if (field.type === "text" && value.length < Number(field.minLength)) {
        return `Please enter at least ${field.minLength} characters.`;
    }

    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address.";
    }

    if (field.tagName === "TEXTAREA" && value.length < Number(field.minLength)) {
        return `Please enter at least ${field.minLength} characters.`;
    }

    return "";
}

function validateField(field) {
    const errorElement = document.querySelector(`#${field.id}-error`);
    const errorMessage = getFieldError(field);
    errorElement.textContent = errorMessage;
    field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    return !errorMessage;
}

function updateMessageCount() {
    messageCount.textContent = `${messageInput.value.length} / ${messageInput.maxLength} characters`;
}

function filterSkills(category) {
    skillItems.forEach((item) => {
        item.hidden = category !== "all" && item.dataset.skillCategory !== category;
    });

    skillHeadings.forEach((heading) => {
        const isVisible = category === "all" || heading.dataset.skillHeading === category;
        heading.hidden = !isVisible;
        heading.nextElementSibling.hidden = !isVisible;
    });

    const visibleCount = Array.from(skillItems).filter((item) => !item.hidden).length;
    document.querySelector("#filter-status").textContent =
        `Showing ${category === "all" ? "all" : category} ${visibleCount} skills.`;

    skillFilters.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === category));
    });
}

let savedTheme = "dark";
try {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
        savedTheme = storedTheme;
    }
} catch (error) {
    console.warn("Could not read the saved theme preference.", error);
}
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme, true);
});

skillFilters.forEach((button) => {
    button.addEventListener("click", () => filterSkills(button.dataset.filter));
});
filterSkills("all");

const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
fields.forEach((field) => {
    field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        validateField(field);
    });

    field.addEventListener("input", () => {
        if (field.dataset.touched === "true") {
            validateField(field);
        }
        if (field === messageInput) {
            updateMessageCount();
        }
    });
});
updateMessageCount();

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = fields.filter((field) => {
        field.dataset.touched = "true";
        return !validateField(field);
    });

    if (invalidFields.length > 0) {
        formStatus.textContent = "Please correct the highlighted fields and try again.";
        invalidFields[0].focus();
        return;
    }

    const name = document.querySelector("#name").value.trim();
    formStatus.textContent =
        `Thanks, ${name}! Your details are valid, but this demo does not send messages yet.`;
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
