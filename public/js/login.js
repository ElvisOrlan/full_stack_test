document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            localStorage.setItem("token", data.token);

            // Redirection vers l'URL du dashboard
            window.location.href = "/dashboard";
        } else {
            alert(data.error || "Erreur de connexion");
        }
    });
