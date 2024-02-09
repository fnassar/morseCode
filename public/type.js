window.addEventListener("load", () => {
    document
        .querySelector('textarea[name="post"]')
        .addEventListener("input", function () {
            var remaining = 300 - this.value.length;
            if (remaining < 0) {
                remaining = 0;
            }
            document.getElementById("charRemaining").textContent =
                "min " + remaining + " characters";
        });

    let form = document.getElementById("input-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let email = document.getElementById("email").value;
        let name = document.getElementById("Name").value;
        let post = document.getElementById("post").value;
        let readOut = document.getElementById("readOut");
        let isReadOut = readOut.checked; // This will be either true or false
        console.log("isReadOut", isReadOut);

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add("was-validated");

        let data = {
            email: email,
            name: name,
            post: post,
            readOut: isReadOut,
        };
        let dataJSON = JSON.stringify(data);
        fetch("/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataJSON,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("MY DATAA", data);
                // Clear the input fields
                document.getElementById("email").value = "";
                document.getElementById("Name").value = "";
                document.getElementById("post").value = "";
                document.getElementById("readOut").value = "";
                isReadOut = false;
                // Show a confirmation message
                alert("Submission sent!");
                location.reload();
            });
    });
});
