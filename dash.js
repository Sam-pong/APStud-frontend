const API = window.API_CONFIG.BASE_URL;

function toggleTheme() {
  const body = document.body;
  const btn = document.querySelector(".theme-toggle-sidebar");

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

// Load saved theme on page load
window.onload = function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  const body = document.body;
  const btn = document.querySelector(".theme-toggle-sidebar");
  const user = localStorage.getItem("user");

  body.classList.remove("light", "dark");
  body.classList.add(savedTheme);
  btn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  console.log("user", user);
  document.getElementById("profileUsername").textContent =
    user.username || user.email.split("@")[0];
  document.getElementById("profileEmail").textContent = user.email;
};

// Toggle sidebar for mobile
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// Navigation functions
function showHome() {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".nav-button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Add active class to home button
  buttons[0].classList.add("active");

  // Update content
  document.querySelector(".content-header h1").textContent =
    "Welcome to AP Stud";
  document.querySelector(".content-header p").textContent =
    "Your all-purpose dashboard for educational purposes";

  // Show feature cards (you can customize this later)
  document.querySelector(".feature-grid").style.display = "grid";

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    toggleSidebar();
  }
}

function logoutbruh() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

function showSettings() {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".nav-button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Add active class to settings button
  buttons[1].classList.add("active");

  // Update content
  document.querySelector(".content-header h1").textContent = "Settings";
  document.querySelector(".content-header p").textContent =
    "Manage your preferences";

  // Hide feature cards for settings page
  document.querySelector(".feature-grid").style.display = "none";

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    toggleSidebar();
  }
}

// User profile button
function goToProfile() {
  alert("Profile page will be implemented!");
  // Add navigation to profile page here later
}

// Feature card clicks
function featureClick(featureNumber) {
  alert(`Feature ${featureNumber} clicked! Add your functionality here.`);
  // Add your feature functionality here
}
