const lost = document.getElementById("lost");
const modal = document.getElementById("modal1");

lost.addEventListener("click",function(){
    modal.style.display = "flex";
});

const closeBtn = document.getElementById("close");
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

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
    const item = document.getElementById("item").value;

    const imageName = localStorage.getItem("imageName");

    const report = {
        names,
        item,
        imageName
    }

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    document.getElementById("names").value = "";
    document.getElementById("item").value = "";
    imageInput.value = "";
    preview.src = "";

    localStorage.removeItem("imageName"); 
    
    modal.style.display = "none"; 
})


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