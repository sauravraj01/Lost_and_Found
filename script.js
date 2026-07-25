document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    let campus = document.getElementById("campus").value;
    let name = document.getElementById("name").value;
    let enroll = document.getElementById("enroll").value;
    let contact = document.getElementById("contact").value;
    let password = document.getElementById("password").value;

    if (campus == "" || name == "" || enroll == "" || contact == "" || password == "") {
        document.getElementById("message").innerHTML = "Please fill all fields.";
        document.getElementById("message").style.color = "red";
        return;

    }

    if (contact.length != 10 || isNaN(contact)) {
        document.getElementById("message").innerHTML = "Enter valid Contact Number.";
        document.getElementById("message").style.color = "red";
        return;
    }

    if (campus == "Sector-62" && password != "jiit62") {
        document.getElementById("message").innerHTML = "Wrong Password";
        document.getElementById("message").style.color = "red";
        return;

    }

    if (campus == "Sector-128" && password != "jiit128") {
        document.getElementById("message").innerHTML = "Wrong Password";
        document.getElementById("message").style.color = "red";
        return;

    }

    localStorage.setItem("studentName", name);
    localStorage.setItem("enrollment", enroll);
    localStorage.setItem("campus", campus);
    localStorage.setItem("contact", contact);

    document.getElementById("message").innerHTML = "Login Successful";
    document.getElementById("message").style.color = "green";

    setTimeout(function () {
        window.location = "dashboard.html";
    }, 1000);

});

if (document.getElementById("studentName")) {

    document.getElementById("studentName").innerHTML =
        localStorage.getItem("studentName");

    document.getElementById("studentEnrollment").innerHTML =
        localStorage.getItem("enrollment");

    document.getElementById("studentCampus").innerHTML =
        localStorage.getItem("campus");

    document.getElementById("studentContact").innerHTML =
        localStorage.getItem("contact");

}

function logout() {

    localStorage.clear();

    window.location = "index.html";

}

let lostForm = document.getElementById("lostForm");

if (lostForm) {

    lostForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let itemName = document.getElementById("itemName").value;
        let student = document.getElementById("lostStudentName").value;
        let contact = document.getElementById("lostContact").value;
        let description = document.getElementById("description").value;

        if (itemName == "" || student == "" || contact == "" || description == "") {

            document.getElementById("lostMessage").innerHTML = "Please fill all required fields.";
            document.getElementById("lostMessage").style.color = "red";
            return;

        }

        if (contact.length != 10) {

            document.getElementById("lostMessage").innerHTML = "Enter a valid contact number.";
            document.getElementById("lostMessage").style.color = "red";
            return;

        }

        localStorage.setItem("itemName", itemName);
        localStorage.setItem("description", description);

        document.getElementById("lostMessage").innerHTML = "Lost Item Report Submitted Successfully!";
        document.getElementById("lostMessage").style.color = "green";

        setTimeout(function () {

            window.location = "success.html";

        }, 1000);

    });

}

let foundForm = document.getElementById("foundForm");

if (foundForm) {

    foundForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let item = document.getElementById("foundItem").value;
        let finder = document.getElementById("finderName").value;
        let contact = document.getElementById("finderContact").value;
        let location = document.getElementById("location").value;
        let description = document.getElementById("foundDescription").value;
        let photo = document.getElementById("foundPhoto").value;

        if (item == "" || finder == "" || contact == "" || location == "" || description == "") {

            document.getElementById("foundMessage").innerHTML = "Please fill all fields.";
            document.getElementById("foundMessage").style.color = "red";
            return;

        }

        if (contact.length != 10) {

            document.getElementById("foundMessage").innerHTML = "Enter valid Contact Number.";
            document.getElementById("foundMessage").style.color = "red";
            return;

        }

        if (photo == "") {

            document.getElementById("foundMessage").innerHTML = "Photo is mandatory for Found Items.";
            document.getElementById("foundMessage").style.color = "red";
            return;

        }

        localStorage.setItem("itemName", item);
        localStorage.setItem("description", description);
        localStorage.setItem("location", location);

        document.getElementById("foundMessage").innerHTML = "Found Item Submitted Successfully!";
        document.getElementById("foundMessage").style.color = "green";

        setTimeout(function () {

            window.location = "success.html";

        }, 1000);

    });

}

if (document.getElementById("successName")) {

    document.getElementById("successName").innerHTML =
        localStorage.getItem("studentName");

    document.getElementById("successEnrollment").innerHTML =
        localStorage.getItem("enrollment");

    document.getElementById("successCampus").innerHTML =
        localStorage.getItem("campus");

    document.getElementById("successContact").innerHTML =
        localStorage.getItem("contact");

    document.getElementById("successItem").innerHTML =
        localStorage.getItem("itemName");

    document.getElementById("successDescription").innerHTML =
        localStorage.getItem("description");

}

function viewProfile() {

    alert(
        "Name : " + localStorage.getItem("studentName") +
        "\nEnrollment : " + localStorage.getItem("enrollment") +
        "\nCampus : " + localStorage.getItem("campus") +
        "\nContact : " + localStorage.getItem("contact")
    );

}