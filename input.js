const appState = {
    darkMode : localStorage.getItem("theme") === "dark"
}

const photoInput = document.getElementById("photoInput")
const themeIcon = document.getElementById("themeIcon");
const inputForm = document.getElementById("inputForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const ageInput = document.getElementById("ageInput");
const clearBtn = document.getElementById("clearBtn");
const userOutput = document.getElementById("userOutput");

// Theme Toggle
themeIcon.addEventListener("click", ()=>{
    appState.darkMode = !appState.darkMode;

    document.body.classList.toggle("dark-mode", appState.darkMode);
    themeIcon.textContent = appState.darkMode ? "D" : "L"

    localStorage.setItem("theme", appState.darkMode ? "dark" : "light")

   
})

window.addEventListener("load",()=>{
    const savedUser = JSON.parse(localStorage.getItem("userBio"));
    const savedTheme = localStorage.getItem("selectedTheme")
    if(savedUser)displayBio(savedUser);
    if(savedTheme)applyTheme(savedTheme)
}
)


const themePresets ={
    blue :{ 
       bg:"blue", text:"skyblue"
    },
     red :{
    bg:"maroon", text:"red"
    },
    green : {
        bg:"green", text:"white"
        
    },
    purple : {
      bg:"purple", text:"yellow"
        
    },
    gold :{
    bg:"grey", text: "orange"
    }
}

// Get user Bio
window.addEventListener("load", ()=>{
    const savedUser = JSON.parse(localStorage.getItem("userBio"));
    if(savedUser)
        displayBio(savedUser)
    firstName.value = savedUser.First;
    lastName.value = savedUser.Last;
    ageInput.value = savedUser.Age;
    photoInput.value = savedUser.Photo
})

inputForm.addEventListener("submit", async(e)=>{
    e.preventDefault();

    let photoData = null;
    if(photoInput.files.length>0){
        const file = photoInput.files[0]
        photoData = await  toBase64(file);
    }

    const user = {
        First : firstName.value.trim(),
        Last : lastName.value.trim(),
        Age : ageInput.value.trim(),
        Photo : photoData || JSON.parse(localStorage.getItem("userBio"))?. Photo || null 
    }

if(!user.First || !user.Last || !user.Age){
    userOutput.innerHTML = "Fill all the fields";
    userOutput.style.color = "orange";
    return;
}

displayBio(user)

localStorage.setItem("userBio", JSON.stringify(user));

})

// Clear Bio.
clearBtn.addEventListener("click", () =>{
    firstName.value = "";
    lastName.value = "";
    ageInput.value = "";
    photoInput.value = "";
    userOutput.innerHTML = ""

localStorage.removeItem("userBio")
})

// Display Bio.
function displayBio(user){
    userOutput.innerHTML = `
    <div id = "bioCard">
    ${user.Photo ? `<img src="${user.Photo}" class="profile-pic">` : ""}
    <h1>FirstName: ${user.First}</h1>
    <h1>LastName: ${user.Last}</h1>
    <h1>Age: ${user.Age}</h1>
     <button class="edit-button">Edit Bio</button>
     <button id ="downloadBtn">Download Bio</button>
    <div class="theme-buttons">
        <button class="theme-btn" data-theme="blue">Blue</button>
        <button class="theme-btn" data-theme="red">Red</button>
        <button class="theme-btn" data-theme="green">Green</button>
        <button class="theme-btn" data-theme="purple">Purple</button>
        <button class="theme-btn" data-theme="gold">Gold</button>
    </div>
    </div>`



    attachPresetEvents()

    // Download Bio
    const downloadBtn = document.getElementById("downloadBtn")
    downloadBtn.addEventListener("click", async()=>{
        try{
            const card = document.getElementById("bioCard");
            const popup = document.getElementById("downloadStatus");
            const msg = document.getElementById("downloadMessage");

            // Show popup
            popup.classList.remove("hidden")
            msg.textContent = "Preparing download";

            // Allow animation before popup
            await new Promise(res => setTimeout(res, 3000))

            // Generate image.
            const canvas = await html2canvas(card, {
                scale : 3,
                backgroundColor : null
            })

            // Save File using FirstName.
            const savedUser = JSON.parse(localStorage.getItem("userBio"));
            const fileName =  savedUser?.First
            ? `${savedUser.First.replace(/\s+/g, "_")}_BioCard.png`
            : "Biocard.png"

            //Trigger Download.
            const link = document.createElement("a");
            link.download = fileName;
            link.href = canvas.toDataURL()
            link.click()


           // Show success message.
           msg.textContent = "Download complete!"

        //    Show fadeout animation
        popup.style.animation = "fadeOut 1s fowards"

        // Remove animation
        setTimeout(()=>{
            popup.classList.add("hidden");
            popup.style.animation = "";
        }, 1500)

        } catch(err){
            console.error("Download error: ", err)

            const popup = document.getElementById("downloadStatus");
            const msg = document.getElementById("downloadMessage");

            popup.classList.remove("hidden");
            msg.textContent = "Error downloading bio";

            setTimeout(()=>{popup.classList.add("hidden")},300)
        }
    })

    // Edit Bio
    const editBtn = document.querySelector(".edit-button");
    editBtn.addEventListener("click", ()=>{
        firstName.value = user.First;
        lastName.value = user.Last;
        ageInput.value = user.Age;
        photoInput.value = user.Photo

        window.scrollTo({top:0, behavior:"smooth"})

        firstName.style.borderColor = "yellow";
        lastName.style.borderColor = "blue";
        ageInput.style.borderColor = "green";

        setTimeout(()=>{
        firstName.style.borderColor = "";
        lastName.style.borderColor = "";
        ageInput.style.borderColor = "";
        }, 3000)

    })
}

function toBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
    })
}

// Apply Theme Functions.
function applyTheme(themeName){
    const card = document.getElementById("bioCard");
    const theme = themePresets[themeName];
    if(!theme)return;

   card.style.background = theme.bg;
}

// Attach Preset Events.
function attachPresetEvents(){
    const themeButtons = document.querySelectorAll(".theme-btn");
    themeButtons.forEach(btn =>{
        btn.addEventListener("click",()=>{
            const theme = btn.dataset.theme;
            applyTheme(theme)

            localStorage.setItem("selectedTheme", theme)
        })
    })
}