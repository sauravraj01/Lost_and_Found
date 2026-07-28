document.getElementById("submitbtn").addEventListener("click", function () {

    let maillogin = document.getElementById("maillogin").value;
    let contactlogin = document.getElementById("contactlogin").value;

    if (!maillogin.includes("mail.jiit.ac.in")) {
        alert("Enter valid JIIT email");
        return;
    }

    if (contactlogin.length != 10) {
        alert("Enter valid contact number");
        return;
    }

    window.location.href = "dashboard.html";
});

