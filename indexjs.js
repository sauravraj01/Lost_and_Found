document.getElementById("submitbtn").addEventListener("click", function () {
    let maillogin = document.getElementById("maillogin").value.trim();
    let contactlogin = document.getElementById("contactlogin").value.trim();

    if (!maillogin.includes("mail.jiit.ac.in")) {
        alert("Enter valid JIIT email");
        return;
    }

    if (contactlogin.length !== 10 || isNaN(contactlogin)) {
        alert("Enter valid contact number");
        return;
    }

    localStorage.setItem("userEmail", maillogin);
    localStorage.setItem("userContact", contactlogin);

    // Use email prefix as display name
    const displayName = maillogin.split("@")[0];
    localStorage.setItem("studentName", displayName);

    window.location.href = "dashboard.html";
});
