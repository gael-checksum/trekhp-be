/**
 * Compte à rebours vers la date du Trek HP
 */
(function () {
  const target = new Date(TREK_CONFIG.date_trek).getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById("countdown").style.display = "none";
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);

    document.getElementById("cnt-days").textContent  = days;
    document.getElementById("cnt-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cnt-min").textContent   = String(mins).padStart(2, "0");
  }

  update();
  setInterval(update, 30000);
})();
