/**
 * Soumission mailing list via Google Apps Script
 */
function submitMailingList(e) {
  e.preventDefault();

  const data = {
    type:   "mailing",
    prenom: document.getElementById("ml-prenom").value.trim(),
    nom:    document.getElementById("ml-nom").value.trim(),
    email:  document.getElementById("ml-email").value.trim()
  };

  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Envoi…";

  fetch(TREK_CONFIG.apps_script_mailing, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(JSON.stringify(data))
  })
  .then(function () {
    document.getElementById("mailing-form").style.display = "none";
    document.getElementById("mailing-success").style.display = "block";
  })
  .catch(function () {
    btn.disabled = false;
    btn.textContent = "S'inscrire";
    alert("Une erreur est survenue. Veuillez réessayer ou envoyer un mail à " + TREK_CONFIG.email_contact);
  });
}
