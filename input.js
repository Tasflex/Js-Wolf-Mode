const appState = {
    darkMode : localStorage.getItem("theme") === "dark"
}

const themeIcon = document.getElementById("themeIcon");
const inputForm = document.getElementById("inputForm");
const photoInput = document.getElementById("photoInput");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const ageInput = document.getElementById("ageInput");
const clearBtn = document.getElementById("clearBtn");
const userOutput = document.getElementById("userOutput");

// Theme Toggle.
themeIcon.addEventListener("click", ()=>{
    appState.darkMode = !appState.darkMode;

    document.body.classList.toggle("dark-mode", appState.darkMode)
    themeIcon.textContent = appState.darkMode ? "D":"L";

    localStorage.setItem("theme", appState.darkMode ? "dark":"light")

    const savedTheme = localStorage.getItem("selectedTheme");

    if(savedTheme){
        const activeBtn = document.querySelector(`theme-btn[data-theme ="${savedTheme}"]`)
        if(activeBtn)activeBtn.classList.add("active")
        
    }
})


// Set Theme Colors
const themePresets = {
    blue: {
        light: { background: "#e3f2fd", text: "#0d47a1" },
        dark: { background: "#0d47a1", text: "#bbdefb" }
    },
    red: {
        light: { background: "#ffebee", text: "#b71c1c" },
        dark: { background: "#b71c1c", text: "#ffebee" }
    },
    green: {
        light: { background: "#e8f5e9", text: "#1b5e20" },
        dark: { background: "#1b5e20", text: "#c8e6c9" }
    },
    purple: {
        light: { background: "#f3e5f5", text: "#4a148c" },
        dark: { background: "#4a148c", text: "#f3e5f5" }
    },
    gold: {
        light: { background: "#fff8e1", text: "#8d6e63" },
        dark: { background: "#8d6e63", text: "#fff8e1" }
    }
};


// Restore Saved User.
window.addEventListener("load", ()=>{
    const savedUser = JSON.parse(localStorage.getItem("userBio"));

    if(savedUser){
        displayBio(savedUser)
photoInput.value = savedUser.Photo;
firstName.value = savedUser.First;
lastName.value = savedUser.Last;
ageInput.value = savedUser.Age;
    }
})


// Set Display Bio.
inputForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let photoData = null;
    if(photoInput.files.length>0){
        const file = photoInput.files[0];
        photoData = await toBase64(file)
    }

    const user = {
        First : firstName.value.trim(),
        Last : lastName.value.trim(),
        Age : ageInput.value.trim(),
        Photo : photoData || JSON.parse(localStorage.getItem("userBio"))?.Photo || null
    }

  if(!user.First || !user.Last || !user.Age){
    userOutput.innerHTML ="Fill all the fields";
    userOutput.style.color = "red";
    return;
  } 

  displayBio(user)

  localStorage.setItem("userBio", JSON.stringify(user))
    
})


// Clear Bio.
clearBtn.addEventListener("click", ()=>{
    firstName.value = "";
    lastName.value = "";
    ageInput.value = "";
    photoInput.value = "";
    userOutput.innerHTML = "";

    localStorage.removeItem("userBio")
})

// Display Bio.
function displayBio(user){
    userOutput.innerHTML =
    `<div id="bioCard">
    ${user.Photo ? `<img src="${user.Photo}" class="profile-pic">` : ""}
    <h3>FirstName: ${user.First}</h3>
    <h3>LastName: ${user.Last}</h3>
    <h3>Age: ${user.Age}</h3>
<button class="edit-button">Edit Bio</button>
<button id="downloadBtn">DownloadBio</button>

<h1>Theme Presets</h1>
<div class="theme-buttons">
<button class="theme-btn" data-theme="blue"> Blue </button>
<button class="theme-btn" data-theme="red"> Red </button>
<button class="theme-btn" data-theme="green"> Green </button>
<button class="theme-btn" data-theme="purple"> Purple</button>
<button class="theme-btn" data-theme = "gold"> Gold </button>
<div>

<button id= "randomThemeBtn">Random Theme</button>
    </div>`

    attachPresetEvents() 

  const randomBtn = document.getElementById("randomThemeBtn");
randomBtn.addEventListener("click",()=>{

  const themes = Object.keys(themePresets);
  const randomIndex = Math.floor(Math.random()*themes.length);
  const randomTheme = themes[randomIndex]
   
applyTheme(randomTheme)

  localStorage.setItem("themes", randomTheme)

})
  

    // Download Bio
    downloadBtn.addEventListener("click", async()=>{

        try{
            const popup = document.getElementById("downloadStatus");
            const msg = document.getElementById("downloadMessage");
            const card = document.getElementById("bioCard");
             
            // Show popup 
            popup.classList.remove("hidden");
            msg.textContent = "Preparing download..."

            // Show Animation.
            await new Promise(res =>setTimeout(res, 300))

            // Generate Image.

            const canvas = await html2canvas(card,{
                scale: 3,
                background : null
            })

            // Save Image By FirstName
            const savedUser = JSON.parse(localStorage.getItem("userBio"))
              const fileName = savedUser?.First
              ? `${savedUser.First.replace(/\s+g/, "_")}_Biocard.png`
              :"Biocard.png"

            //   Trigger Download.
            const link = document.createElement("a")
            link.download = fileName;
            link.href = canvas.toDataURL()
            link.click()

            // Show Success Message.
            msg.textContent = "Download Complete!"

            // FadeOut Animation for removing Popup
            popup.style.animation = "fadeOut 1s forwards";

            // Remove Popup
            setTimeout(()=>{
            popup.classList.add("hidden");
            popup.style.animation = "";
            }, 1000)
            
        } catch (err){
            console.error("Download error :", err);
            const popup = document.getElementById("downloadStatus");
            const msg = document.getElementById("downloadMessage");

            popup.classList.remove("hidden")
            msg.textContent = "Error Downloading Bio";
            
            setTimeout(()=>{popup.classList.add("hidden"),1500})
        }
    })

    // Edit Button
    const editBtn = document.querySelector(".edit-button");
    editBtn.addEventListener("click", ()=>{
          photoInput.value = user.Photo;
          firstName.value = user.First;
          lastName.value = user.Last;
          ageInput.value = user.Age;

          window.scrollTo({top:0, behavior:"smooth"})

          photoInput.style.borderColor = "pink";
          firstName.style.borderColor = "yellow";
          lastName.style.borderColor = "green";
          ageInput.style.borderColor = "orange";

          setTimeout(()=>{
          photoInput.style.borderColor = "";
          firstName.style.borderColor = "";
          lastName.style.borderColor = "";
          ageInput.style.borderColor = "";
          }, 3000)
    })
}

// ApplyTheme Functions

// ApplyTheme Functions
function applyTheme(themeName){
    const card = document.getElementById("bioCard");
    const theme = themePresets[themeName];
    if(!theme)return;

    const isDark = document.body.classList.contains("dark-mode");
    const selected = isDark? theme.dark : theme.light;

    card.style.background = selected.background;

    const elements = card.querySelectorAll("h1, h2, h3, p, span, button, btn");
    elements.forEach(el =>{
        el.style.color = selected.text;

    })
}


// Attach Theme Presets
function attachPresetEvents(){
    const themeButtons = document.querySelectorAll(".theme-btn")
    themeButtons.forEach(btn =>{
        btn.addEventListener("click", () => {

        //    Remove Active From All Buttons.
        themeButtons.forEach(b => b.classList.remove("active"));

        btn.classList.add("active")

            const theme = btn.dataset.theme;

            applyTheme(theme);

            localStorage.setItem("selectedTheme", theme)
        })
    })
}


// Photo Manipulation.
function toBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file)
    })
}

