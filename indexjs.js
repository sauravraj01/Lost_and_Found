// ==================== Users in localStorage ====================
// Shape: { name, email, contact, password }

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function setSession(user) {
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userContact", user.contact);
    localStorage.setItem("studentName", user.name);
}

function isValidJiitEmail(email) {
    return email.toLowerCase().includes("@mail.jiit.ac.in");
}

// Already logged in → dashboard
if (localStorage.getItem("userEmail")) {
    window.location.href = "dashboard.html";
}

// ==================== Tabs ====================

const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

function showAuthTab(which) {
    const isLogin = which === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabSignup.classList.toggle("active", !isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabSignup.setAttribute("aria-selected", String(!isLogin));
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
    loginError.hidden = true;
    signupError.hidden = true;
}

tabLogin.addEventListener("click", function () {
    showAuthTab("login");
});

tabSignup.addEventListener("click", function () {
    showAuthTab("signup");
});

function showError(el, message) {
    el.textContent = message;
    el.hidden = false;
}

// ==================== Sign up ====================

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const contact = document.getElementById("signupContact").value.trim();
    const password = document.getElementById("signupPassword").value;

    signupError.hidden = true;

    if (!name || !email || !contact || !password) {
        showError(signupError, "Please fill in all fields.");
        return;
    }

    if (!isValidJiitEmail(email)) {
        showError(signupError, "Use a valid JIIT email (@mail.jiit.ac.in).");
        return;
    }

    if (contact.length !== 10 || isNaN(contact)) {
        showError(signupError, "Enter a valid 10-digit contact number.");
        return;
    }

    if (password.length < 6) {
        showError(signupError, "Password must be at least 6 characters.");
        return;
    }

    const users = getUsers();
    if (users.some(function (u) { return u.email === email; })) {
        showError(signupError, "An account with this email already exists. Sign in instead.");
        return;
    }

    const user = { name, email, contact, password };
    users.push(user);
    saveUsers(users);
    setSession(user);
    window.location.href = "dashboard.html";
});

// ==================== Sign in ====================

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    loginError.hidden = true;

    if (!email || !password) {
        showError(loginError, "Please enter email and password.");
        return;
    }

    const users = getUsers();
    const user = users.find(function (u) {
        return u.email === email && u.password === password;
    });

    if (!user) {
        showError(loginError, "Invalid email or password. Sign up if you are new.");
        return;
    }

    setSession(user);
    window.location.href = "dashboard.html";
});
