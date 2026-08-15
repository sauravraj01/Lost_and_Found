/* ---------- NAVBAR ---------- */

const studentName = localStorage.getItem("studentName") || "";
const userEmail = localStorage.getItem("userEmail") || "";
const userContact = localStorage.getItem("userContact") || "";

if (!userEmail) {
    window.location.href = "index.html";
}

const welcomeEl = document.getElementById("welcomeName");
const navUserEl = document.getElementById("navUser");
const profileAvatar = document.getElementById("profileAvatar");
const profileEmail = document.getElementById("profileEmail");

if (welcomeEl) welcomeEl.textContent = studentName || "User";
if (navUserEl) navUserEl.textContent = studentName || "User";
if (profileAvatar) profileAvatar.textContent = (studentName || "U").charAt(0).toUpperCase();
if (profileEmail) profileEmail.textContent = userEmail;

const profileMenu = document.querySelector(".profile-menu");
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = profileMenu.classList.toggle("open");
    profileDropdown.hidden = !isOpen;
    profileBtn.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", function (e) {
    if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("open");
        profileDropdown.hidden = true;
        profileBtn.setAttribute("aria-expanded", "false");
    }
});

document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userContact");
    localStorage.removeItem("studentName");
    window.location.replace("index.html");
});

document.getElementById("mineBtn").addEventListener("click", function () {
    profileMenu.classList.remove("open");
    profileDropdown.hidden = true;
    setActiveFilter("mine");
});

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", refreshBoard);

const reportModal = document.getElementById("reportModal");
const reportBtn = document.getElementById("reportBtn");
const tabLost = document.getElementById("tabLost");
const tabFound = document.getElementById("tabFound");
const lostPanel = document.getElementById("lostPanel");
const foundPanel = document.getElementById("foundPanel");

function openReportModal(tab) {
    reportModal.style.display = "flex";
    showReportTab(tab || "lost");

    const nameInput = document.getElementById("names");
    const foundNameInput = document.getElementById("foundNames");
    if (nameInput && !nameInput.value) nameInput.value = studentName;
    if (foundNameInput && !foundNameInput.value) foundNameInput.value = studentName;
}

function closeReportModal() {
    reportModal.style.display = "none";
}

function showReportTab(tab) {
    const isLost = tab === "lost";
    tabLost.classList.toggle("active", isLost);
    tabFound.classList.toggle("active", !isLost);
    tabLost.setAttribute("aria-selected", String(isLost));
    tabFound.setAttribute("aria-selected", String(!isLost));
    lostPanel.hidden = !isLost;
    foundPanel.hidden = isLost;
}

reportBtn.addEventListener("click", function () {
    openReportModal("lost");
});

tabLost.addEventListener("click", function () {
    showReportTab("lost");
});

tabFound.addEventListener("click", function () {
    showReportTab("found");
});

document.getElementById("reportClose").addEventListener("click", closeReportModal);

reportModal.addEventListener("click", function (e) {
    if (e.target === reportModal) closeReportModal();
});


/* ---------- FILTER ---------- */

const filterGroup = document.getElementById("filterGroup");
const sortSelect = document.getElementById("sortSelect");

let activeFilter = "all";
let activeSort = "newest";

function setActiveFilter(filter) {
    activeFilter = filter;
    filterGroup.querySelectorAll(".chip").forEach(function (chip) {
        chip.classList.toggle("active", chip.dataset.filter === filter);
    });
    refreshBoard();
}

filterGroup.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    setActiveFilter(btn.dataset.filter);
});

sortSelect.addEventListener("change", function () {
    activeSort = sortSelect.value;
    refreshBoard();
});

function matchesSearch(textParts, query) {
    if (!query) return true;
    return textParts.join(" ").toLowerCase().includes(query);
}

function sortReports(list, getName, getId) {
    const mode = activeSort;
    const sorted = list.slice();

    sorted.sort(function (a, b) {
        if (mode === "newest") return getId(b) - getId(a);
        if (mode === "oldest") return getId(a) - getId(b);
        if (mode === "az") return getName(a).localeCompare(getName(b));
        if (mode === "za") return getName(b).localeCompare(getName(a));
        return 0;
    });

    return sorted;
}

function refreshBoard() {
    renderLostReports();
    renderFoundReports();
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const STOPWORDS = new Set([
    "a", "an", "the", "is", "was", "were", "in", "on", "at", "near",
    "found", "lost", "my", "i", "it", "this", "that", "with", "and",
    "of", "to", "for", "have", "has", "had", "some", "there",
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

    const MIN_COMMON_KEYWORDS = 3;
    let commonCount = 0;

    for (const word of foundWords) {
        if (lostWords.has(word)) {
            commonCount++;
            if (commonCount >= MIN_COMMON_KEYWORDS) return true;
        }
    }
    return false;
}

function linkMatch(lostReport, foundReport) {
    lostReport.possibleMatch = {
        id: foundReport.id,
        foundNames: foundReport.foundNames,
        foundItem: foundReport.foundItem,
        foundDescription: foundReport.foundDescription,
        image: foundReport.image,
        ownerEmail: foundReport.ownerEmail || null
    };

    foundReport.possibleMatch = {
        id: lostReport.id,
        names: lostReport.names,
        item: lostReport.item,
        lostDescription: lostReport.lostDescription,
        image: lostReport.image,
        ownerEmail: lostReport.ownerEmail || null
    };
}

if (typeof emailjs !== "undefined" && EMAILJS_CONFIG && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

function sendMatchEmail(lostReport, foundReport) {
    if (!lostReport.ownerEmail) return Promise.resolve();
    if (lostReport.emailNotified) return Promise.resolve();

    const configReady =
        typeof emailjs !== "undefined" &&
        EMAILJS_CONFIG &&
        EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY";

    if (!configReady) {
        console.warn("EmailJS not configured. Skipping email. See emailjs-config.js");
        lostReport.emailNotified = true;
        return Promise.resolve();
    }

    const params = {
        to_email: lostReport.ownerEmail,
        to_name: lostReport.names || "Student",
        item_name: lostReport.item || "your item",
        found_by: foundReport.foundNames || "someone",
        found_description: foundReport.foundDescription || "",
        message:
            "A possible match was found for your lost item on FindIT. Open the dashboard and check the Match filter."
    };

    return emailjs
        .send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, params)
        .then(function () {
            lostReport.emailNotified = true;
            console.log("Match email sent to", lostReport.ownerEmail);
        })
        .catch(function (err) {
            console.error("EmailJS error:", err);
        });
}


/* ---------- LOST ITEMS ---------- */

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const container = document.getElementById("reportsContainer");
const lostSection = document.getElementById("lostSection");
const lostCountEl = document.getElementById("lostCount");
const lostEmpty = document.getElementById("lostEmpty");
let currentLostImageBase64 = null;

imageInput.addEventListener("change", async function () {
    const file = imageInput.files[0];
    if (file) {
        currentLostImageBase64 = await fileToBase64(file);
        preview.src = currentLostImageBase64;
        preview.hidden = false;
    }
});

document.getElementById("submit").addEventListener("click", async function () {
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
        possibleMatch: null,
        ownerEmail: userEmail,
        ownerContact: userContact,
        emailNotified: false
    };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let foundReportsForCheck = JSON.parse(localStorage.getItem("foundReports")) || [];
    let foundChanged = false;
    const emailJobs = [];

    foundReportsForCheck.forEach(function (existingFound) {
        if (isMatch(report, existingFound)) {
            linkMatch(report, existingFound);
            foundChanged = true;
            emailJobs.push(sendMatchEmail(report, existingFound));
        }
    });

    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    if (foundChanged) {
        localStorage.setItem("foundReports", JSON.stringify(foundReportsForCheck));
    }

    await Promise.all(emailJobs);
    localStorage.setItem("reports", JSON.stringify(reports));

    if (emailJobs.length) {
        alert("Possible match found! If EmailJS is configured, a mail was sent to your account email.");
    }

    document.getElementById("names").value = "";
    document.getElementById("item").value = "";
    document.getElementById("lostDescription").value = "";
    imageInput.value = "";
    preview.src = "";
    preview.hidden = true;
    currentLostImageBase64 = null;

    closeReportModal();
    refreshBoard();
});

function renderLostReports() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = activeFilter;
    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    if (filter === "found") {
        lostSection.style.display = "none";
        return;
    }
    lostSection.style.display = "";

    reports = reports.filter(function (report) {
        if (filter === "matched" && !report.possibleMatch) return false;
        if (filter === "mine" && report.ownerEmail !== userEmail) return false;
        return matchesSearch(
            [report.item, report.names, report.lostDescription],
            query
        );
    });

    reports = sortReports(
        reports,
        function (r) { return r.item || ""; },
        function (r) { return r.id || 0; }
    );

    container.innerHTML = "";
    lostCountEl.textContent = reports.length;
    lostEmpty.hidden = reports.length > 0;
    lostEmpty.textContent =
        filter === "mine"
            ? "You have not reported any lost items yet."
            : "No lost items match your search.";

    reports.forEach(function (report) {
        const card = document.createElement("div");
        card.classList.add("card");

        const isMine = report.ownerEmail === userEmail;
        let matchHtml = "";
        if (report.possibleMatch) {
            matchHtml = `
                <div class="matchBox">
                    <strong>Possible Match Found!</strong>
                    <p>Found by: ${escapeHtml(report.possibleMatch.foundNames)}</p>
                    <p>${escapeHtml(report.possibleMatch.foundDescription)}</p>
                    ${report.possibleMatch.image ? `<img src="${report.possibleMatch.image}" alt="Match" />` : ""}
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${escapeHtml(report.item)}${isMine ? ' <span class="mine-tag">Yours</span>' : ""}</h3>
            <p class="meta">Reported by: ${escapeHtml(report.names)}</p>
            <p>${escapeHtml(report.lostDescription)}</p>
            ${report.image ? `<img src="${report.image}" alt="${escapeHtml(report.item)}" />` : ""}
            ${matchHtml}
        `;

        container.appendChild(card);
    });
}


/* ---------- FOUND ITEMS ---------- */

const foundImageInput = document.getElementById("foundImage");
const foundPreview = document.getElementById("foundPreview");
const foundContainer = document.getElementById("foundContainer");
const foundSection = document.getElementById("foundSection");
const foundCountEl = document.getElementById("foundCount");
const foundEmpty = document.getElementById("foundEmpty");
let currentFoundImageBase64 = null;

foundImageInput.addEventListener("change", async function () {
    const file = foundImageInput.files[0];
    if (file) {
        currentFoundImageBase64 = await fileToBase64(file);
        foundPreview.src = currentFoundImageBase64;
        foundPreview.hidden = false;
    }
});

document.getElementById("foundSubmit").addEventListener("click", async function () {
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
        possibleMatch: null,
        ownerEmail: userEmail,
        ownerContact: userContact
    };

    let foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let lostChanged = false;
    const emailJobs = [];

    reports.forEach(function (lostReport) {
        if (isMatch(lostReport, foundReport)) {
            linkMatch(lostReport, foundReport);
            lostChanged = true;
            emailJobs.push(sendMatchEmail(lostReport, foundReport));
        }
    });

    foundReports.push(foundReport);
    localStorage.setItem("foundReports", JSON.stringify(foundReports));

    if (lostChanged) {
        await Promise.all(emailJobs);
        localStorage.setItem("reports", JSON.stringify(reports));
    }

    if (emailJobs.length) {
        alert("Matched a lost report! The owner will get an email if EmailJS is set up.");
    }

    document.getElementById("foundNames").value = "";
    document.getElementById("foundItem").value = "";
    document.getElementById("foundDescription").value = "";
    foundImageInput.value = "";
    foundPreview.src = "";
    foundPreview.hidden = true;
    currentFoundImageBase64 = null;

    closeReportModal();
    refreshBoard();
});

function renderFoundReports() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = activeFilter;
    let foundReports = JSON.parse(localStorage.getItem("foundReports")) || [];

    if (filter === "lost") {
        foundSection.style.display = "none";
        return;
    }
    foundSection.style.display = "";

    foundReports = foundReports.filter(function (report) {
        if (filter === "matched" && !report.possibleMatch) return false;
        if (filter === "mine" && report.ownerEmail !== userEmail) return false;
        return matchesSearch(
            [report.foundItem, report.foundNames, report.foundDescription],
            query
        );
    });

    foundReports = sortReports(
        foundReports,
        function (r) { return r.foundItem || ""; },
        function (r) { return r.id || 0; }
    );

    foundContainer.innerHTML = "";
    foundCountEl.textContent = foundReports.length;
    foundEmpty.hidden = foundReports.length > 0;
    foundEmpty.textContent =
        filter === "mine"
            ? "You have not reported any found items yet."
            : "No found items match your search.";

    foundReports.forEach(function (report) {
        const card = document.createElement("div");
        card.classList.add("card");

        const isMine = report.ownerEmail === userEmail;
        let matchHtml = "";
        if (report.possibleMatch) {
            matchHtml = `
                <div class="matchBox">
                    <strong>Possible Match Found!</strong>
                    <p>Lost by: ${escapeHtml(report.possibleMatch.names)}</p>
                    <p>${escapeHtml(report.possibleMatch.lostDescription)}</p>
                    ${report.possibleMatch.image ? `<img src="${report.possibleMatch.image}" alt="Match" />` : ""}
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${escapeHtml(report.foundItem)}${isMine ? ' <span class="mine-tag">Yours</span>' : ""}</h3>
            <p class="meta">Found by: ${escapeHtml(report.foundNames)}</p>
            <p>${escapeHtml(report.foundDescription)}</p>
            ${report.image ? `<img src="${report.image}" alt="${escapeHtml(report.foundItem)}" />` : ""}
            ${matchHtml}
        `;

        foundContainer.appendChild(card);
    });
}

refreshBoard();
