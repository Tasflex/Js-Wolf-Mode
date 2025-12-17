const appState = {
    darkMode : localStorage.getItem("theme") === "dark"
}

const themeIcon = document.getElementById("themeIcon");
const inputForm = document.getElementById("inputForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const ageInput = document.getElementById("ageinput");
const clearBtn = document.getElementById("clearBtn");
const userOutput = document.getElementById("userOutput");

// Theme Toggle
themeIcon.addEventListener("click", ()=>{
    appState.darkMode = !appState.darkMode;

    document.body.classList.toggle("dark-mode", appState.darkMode);
    themeIcon.textContent = appState.darkMode ? "D" : "L"

    localStorage.setItem("theme", appState.darkMode ? "dark" : "light")
})