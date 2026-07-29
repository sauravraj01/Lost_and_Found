const lost = document.getElementById("lost");
const modal = document.getElementById("modal1");

lost.addEventListener("click",function(){
    modal.style.display = "flex";
});

const found = document.getElementById("found");
const foundModal = document.getElementById("foundModal");

found.addEventListener("click",function(){
    foundModal.style.display = "flex";
})

const closeBtn = document.getElementById("close");
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

const closeBtnfound = document.getElementById("foundClose");
closeBtnfound.addEventListener("click", function () {
    foundModal.style.display = "none";
});


// ======================LOST ITEM ============================//

const imageInput = document.getElementById("image");

const preview = document.getElementById("preview");

imageInput.addEventListener("change",function(){
    const file = imageInput.files[0];

    if(file){
        preview.src = URL.createObjectURL(file);
    }

    localStorage.setItem("imageName", file.name);
})


const submitform = document.getElementById("submit");
submitform.addEventListener("click",function(){
    const names = document.getElementById("names").value;
    const lostDescription = document.getElementById("lostDescription").value;
    const item = document.getElementById("item").value;
    const imageName = localStorage.getItem("imageName");

    const report = {
        names,
        item,
        lostDescription,
        imageName
    }

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    document.getElementById("names").value = "";
    document.getElementById("item").value = "";
    document.getElementById("lostDescription").value = "";
    imageInput.value = "";
    preview.src = "";

    localStorage.removeItem("imageName"); 
    modal.style.display = "none"; 
    
})

// ================= FOUND ITEM =================

const foundImageInput = document.getElementById("foundImage");
const foundPreview = document.getElementById("foundPreview");

foundImageInput.addEventListener("change",function(){
    const file = foundImageInput.files[0];

    if(file){
        foundPreview.src = URL.createObjectURL(file);
        localStorage.setItem("foundImageName", file.name);
    }
});

const foundSubmit = document.getElementById("foundSubmit");

foundSubmit.addEventListener("click",function(){
    const foundNames = document.getElementById("foundNames").value;
    const foundItem = document.getElementById("foundItem").value;
    const foundDescription = document.getElementById("foundDescription").value;
    const foundImageName = localStorage.getItem("foundImageName");

    const foundReport = {
        foundNames,
        foundItem,
        foundDescription,
        foundImageName
    };


    let foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];
    foundReports.push(foundReport);

    localStorage.setItem(
        "foundReports",
        JSON.stringify(foundReports)
    );
    // clear form

    document.getElementById("foundNames").value = "";
    document.getElementById("foundItem").value = "";
    document.getElementById("foundDescription").value = "";

    foundImageInput.value = "";
    foundPreview.src = "";


    localStorage.removeItem("foundImageName");
    foundModal.style.display = "none";


});


const container = document.getElementById("reportsContainer");

let reports = JSON.parse(localStorage.getItem("reports")) || [];

reports.forEach(function(report){

    const card = document.createElement("div");

    card.innerHTML = `
        <h3>${report.item}</h3>
        <p>Reported by: ${report.names}</p>
        <p>Image: ${report.imageName}</p>
    `;

    container.appendChild(card);

});


const foundContainer = document.getElementById("foundContainer");
let foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];


foundReports.forEach(function(report){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${report.foundItem}</h3>
        <p>Found by: ${report.foundNames}</p>
        <p>${report.foundDescription}</p>
        <p>Image: ${report.foundImageName}</p>
    `;

    foundContainer.appendChild(card);

});