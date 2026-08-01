const lost = document.getElementById("lost");
const modal = document.getElementById("modal1");

lost.addEventListener("click", function () {
    modal.style.display = "flex";
});

const found = document.getElementById("found");
const foundModal = document.getElementById("foundModal");

found.addEventListener("click", function () {
    foundModal.style.display = "flex";
});

const closeBtn = document.getElementById("close");
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

const closeBtnfound = document.getElementById("foundClose");
closeBtnfound.addEventListener("click", function () {
    foundModal.style.display = "none";
});

// ============ helper: file -> base64 ============
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ============ helper: does a lost/found pair match ============

// common filler words that shouldn't count as a "match" by themselves
const STOPWORDS = new Set([
    "a", "an", "the", "is", "was", "were", "in", "on", "at", "near",
    "found", "lost", "my", "i", "it", "this", "that", "with", "and",
    "of", "to", "for", "have", "has", "had", "some", "there", "near",
    "please", "help", "item", "items"
]);

function getKeywords(text) {
    return (text || "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(word => word.length > 1 && !STOPWORDS.has(word));
}

function isMatch(lostReport, foundReport) {
    const lostWords = new Set([
        ...getKeywords(lostReport.item),
        ...getKeywords(lostReport.lostDescription)
    ]);
    const foundWords = new Set([
        ...getKeywords(foundReport.foundItem),
        ...getKeywords(foundReport.foundDescription)
    ]);

    if (lostWords.size === 0 || foundWords.size === 0) return false;

    // require at least 3 common meaningful keywords to count as a match
    const MIN_COMMON_KEYWORDS = 3;
    let commonCount = 0;

    for (const word of foundWords) {
        if (lostWords.has(word)) {
            commonCount++;
            if (commonCount >= MIN_COMMON_KEYWORDS) {
                return true;
            }
        }
    }
    return false;
}

// sets possibleMatch on BOTH the lost report and the found report
function linkMatch(lostReport, foundReport) {
    lostReport.possibleMatch = {
        id: foundReport.id,
        foundNames: foundReport.foundNames,
        foundItem: foundReport.foundItem,
        foundDescription: foundReport.foundDescription,
        image: foundReport.image
    };

    foundReport.possibleMatch = {
        id: lostReport.id,
        names: lostReport.names,
        item: lostReport.item,
        lostDescription: lostReport.lostDescription,
        image: lostReport.image
    };
}

// ======================LOST ITEM ============================//

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

let currentLostImageBase64 = null;

imageInput.addEventListener("change", async function () {
    const file = imageInput.files[0];
    if (file) {
        currentLostImageBase64 = await fileToBase64(file);
        preview.src = currentLostImageBase64;
    }
});

const submitform = document.getElementById("submit");
submitform.addEventListener("click", function () {
    const names = document.getElementById("names").value.trim();
    const lostDescription = document.getElementById("lostDescription").value.trim();
    const item = document.getElementById("item").value.trim();

    if (!names || !item || !lostDescription) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const report = {
        id: Date.now(),
        names,
        item,
        lostDescription,
        image: currentLostImageBase64,
        possibleMatch: null
    };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let foundReportsForCheck = JSON.parse(localStorage.getItem("foundReports")) || [];
    let foundChanged = false;

    foundReportsForCheck.forEach(function (existingFound) {
        if (isMatch(report, existingFound)) {
            linkMatch(report, existingFound);
            foundChanged = true;
        }
    });

    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    if (foundChanged) {
        localStorage.setItem("foundReports", JSON.stringify(foundReportsForCheck));
    }

    document.getElementById("names").value = "";
    document.getElementById("item").value = "";
    document.getElementById("lostDescription").value = "";
    imageInput.value = "";
    preview.src = "";
    currentLostImageBase64 = null;

    modal.style.display = "none";

    renderLostReports();
    renderFoundReports();
});

// ================= FOUND ITEM =================

const foundImageInput = document.getElementById("foundImage");
const foundPreview = document.getElementById("foundPreview");

let currentFoundImageBase64 = null;

foundImageInput.addEventListener("change", async function () {
    const file = foundImageInput.files[0];
    if (file) {
        currentFoundImageBase64 = await fileToBase64(file);
        foundPreview.src = currentFoundImageBase64;
    }
});

const foundSubmit = document.getElementById("foundSubmit");

foundSubmit.addEventListener("click", function () {
    const foundNames = document.getElementById("foundNames").value.trim();
    const foundItem = document.getElementById("foundItem").value.trim();
    const foundDescription = document.getElementById("foundDescription").value.trim();

    if (!foundNames || !foundItem || !foundDescription) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const foundReport = {
        id: Date.now(),
        foundNames,
        foundItem,
        foundDescription,
        image: currentFoundImageBase64,
        possibleMatch: null
    };

    let foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];

    // ---- check against existing lost reports for a match ----
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let lostChanged = false;

    reports.forEach(function (lostReport) {
        if (isMatch(lostReport, foundReport)) {
            linkMatch(lostReport, foundReport);
            lostChanged = true;
        }
    });

    foundReports.push(foundReport);
    localStorage.setItem("foundReports", JSON.stringify(foundReports));

    if (lostChanged) {
        localStorage.setItem("reports", JSON.stringify(reports));
    }

    // clear form
    document.getElementById("foundNames").value = "";
    document.getElementById("foundItem").value = "";
    document.getElementById("foundDescription").value = "";
    foundImageInput.value = "";
    foundPreview.src = "";
    currentFoundImageBase64 = null;

    foundModal.style.display = "none";

    renderFoundReports();
    renderLostReports();
});

// ================= RENDER =================

const container = document.getElementById("reportsContainer");
const foundContainer = document.getElementById("foundContainer");

function renderLostReports() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    container.innerHTML = "";

    reports.forEach(function (report) {
        const card = document.createElement("div");
        card.classList.add("card");

        let matchHtml = "";
        if (report.possibleMatch) {
            matchHtml = `
                <div class="matchBox">
                    <strong>Possible Match Found!</strong>
                    <p>Found by: ${report.possibleMatch.foundNames}</p>
                    <p>${report.possibleMatch.foundDescription}</p>
                    ${report.possibleMatch.image ? `<img src="${report.possibleMatch.image}" width="100" />` : ""}
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${report.item}</h3>
            <p>Reported by: ${report.names}</p>
            <p>${report.lostDescription}</p>
            ${report.image ? `<img src="${report.image}" width="100" />` : ""}
            ${matchHtml}
        `;

        container.appendChild(card);
    });
}

function renderFoundReports() {
    const foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];
    foundContainer.innerHTML = "";

    foundReports.forEach(function (report) {
        const card = document.createElement("div");
        card.classList.add("card");

        let matchHtml = "";
        if (report.possibleMatch) {
            matchHtml = `
                <div class="matchBox">
                    <strong>Possible Match Found!</strong>
                    <p>Lost by: ${report.possibleMatch.names}</p>
                    <p>${report.possibleMatch.lostDescription}</p>
                    ${report.possibleMatch.image ? `<img src="${report.possibleMatch.image}" width="100" />` : ""}
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${report.foundItem}</h3>
            <p>Found by: ${report.foundNames}</p>
            <p>${report.foundDescription}</p>
            ${report.image ? `<img src="${report.image}" width="100" />` : ""}
            ${matchHtml}
        `;
        foundContainer.appendChild(card);
    });
}

renderLostReports();
renderFoundReports();