function toggleTheme() {
  const body = document.body;
  const btn = document.querySelector(".theme-toggle");

  if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("dark");
    btn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    btn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

window.onload = async function () {
  const currentPage = window.location.pathname;

  const savedTheme = localStorage.getItem("theme") || "light";
  const body = document.body;
  const btn = document.querySelector(".theme-toggle");

  body.classList.remove("light", "dark");
  body.classList.add(savedTheme);
  btn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  if (currentPage.includes("dash.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
      return;
    }

    try {
      const response = await fetch("http://localhost:5005/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (!result.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
        return;
      }

      console.log("User is valid:", result.data);
    } catch (error) {
      console.log("Verification failed:", error);
      window.location.href = "index.html";
    }
  }
};

function goToRegister() {
  window.location.href = "register.html";
}

async function login() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("loginMessage");
  const submitBtn = document.querySelector('button[name="logbutton"]');

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  try {
    console.log("Sending fetch request...");
    const response = await fetch("http://localhost:5005/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: email,
        password: password,
      }),
    });

    console.log("Response received:", response.status);
    const result = await response.json();
    console.log("Response", response);
    console.log("Result:", result);
    if (result.success) {
      messageDiv.style.color = "green";
      messageDiv.textContent = result.message;
      console.log("User logged in:", result.user);

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      window.location.href = "dash.html";
    } else {
      if (result.code === 400 && result.message.includes("not confirmed")) {
        messageDiv.style.color = "red";
        messageDiv.innerHTML = `Email not confirmed. <a href="#" id="resendLink">Click here to confirm</a>`;

        document
          .getElementById("resendLink")
          .addEventListener("click", async (e) => {
            e.preventDefault();
            messageDiv.style.color = "black";
            messageDiv.textContent = "Sending confirmation email...";

            try {
              const resendResponse = await fetch(
                "http://localhost:5005/api/auth/resend",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: email,
                    password: password,
                  }),
                },
              );

              const resendResult = await resendResponse.json();
              messageDiv.style.color = resendResult.success ? "green" : "red";
              messageDiv.textContent = resendResult.message;
            } catch (err) {
              messageDiv.style.color = "red";
              messageDiv.textContent = "Failed to resend confirmation email.";
            }
          });
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = result.message;
      }
    }
  } catch (error) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Network error: " + error.message;

    console.error("Login error:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confpass = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("loginMessage");
  const submitBtn = document.querySelector('button[name="regButton"]');

  submitBtn.disabled = true;
  submitBtn.textContent = "Registering User...";

  if (email.trim() === "" || username.trim() === "" || password.trim() === "") {
    messageDiv.style.color = "red";
    messageDiv.textContent = "All fields are required.";
  } else if (!isValidEmail(email)) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Please enter a valid email address.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
    return;
  } else if (password !== confpass) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Passwords do not match.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
    return;
  } else {
    try {
      console.log("Sending fetch request...");
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          email: email,
          password: password,
        }),
      });

      console.log("Response received:", response.status);
      const result = await response.json();

      console.log("Result:", result);
      if (result.success) {
        messageDiv.style.color = "green";
        messageDiv.textContent = result.message;
        console.log("Success");

        window.location.href = "index.html";
      } else if (!result.success) {
        messageDiv.style.color = "red";
        messageDiv.textContent = result.message;
      }
    } catch (error) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Network error: " + error.message;
      console.error("Register error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
