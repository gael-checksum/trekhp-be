/**
 * Formulaire d'inscription Trek HP
 * - Génération dynamique des blocs membres
 * - Calcul de score de priorité en temps réel
 * - Soumission vers Google Apps Script
 */

const STATUTS = [
  { val: "honneur", label: "Membre actif Groupe Honneur (inscrit scouts)", pts: TREK_CONFIG.priorite.groupe_honneur },
  { val: "veteran",  label: "5 participations ou plus",                     pts: TREK_CONFIG.priorite.veteran },
  { val: "ancien",   label: "1 à 3 participations",                         pts: TREK_CONFIG.priorite.ancien },
  { val: "nouveau",  label: "Première participation",                        pts: TREK_CONFIG.priorite.nouveau }
];

function ajusterMembres() {
  const nb = parseInt(document.getElementById("eq-nb").value);
  const container = document.getElementById("membres-container");
  container.innerHTML = "";

  if (!nb) return;

  for (let i = 1; i <= nb; i++) {
    container.appendChild(creerBlocMembre(i));
  }

  document.getElementById("score-box").style.display = "flex";
  document.getElementById("section-prefs").style.display = "block";
  document.getElementById("section-responsable").style.display = "block";
  calculerScore();
}

function creerBlocMembre(i) {
  const div = document.createElement("div");
  div.className = "form-section";
  div.innerHTML = `
    <h3>Membre ${i}${i === 1 ? " (responsable d'équipe)" : ""}</h3>
    <div class="membre-bloc" id="membre-${i}">
      <div class="field-row">
        <div>
          <label>Prénom *</label>
          <input type="text" id="m${i}-prenom" required>
        </div>
        <div>
          <label>Nom *</label>
          <input type="text" id="m${i}-nom" required>
        </div>
      </div>
      <div class="field-row">
        <div>
          <label>E-mail *</label>
          <input type="email" id="m${i}-email" required>
        </div>
        <div>
          <label>Statut *</label>
          <select id="m${i}-statut" onchange="calculerScore()" required>
            <option value="">-- choisir --</option>
            ${STATUTS.map(s => `<option value="${s.val}">${s.label} (+${s.pts} pt${s.pts > 1 ? "s" : ""})</option>`).join("")}
          </select>
        </div>
      </div>
      <div id="m${i}-scouts-row" style="display:none;margin-top:0.5rem;font-family:sans-serif;font-size:0.85rem;background:#fffbe6;padding:0.6rem 0.9rem;border-radius:4px;border:1px solid #ffe082">
        <label style="display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer">
          <input type="checkbox" id="m${i}-scouts" style="margin-top:2px">
          <span>Ce membre est inscrit dans un mouvement scout (pas de nouvelle assurance requise)</span>
        </label>
      </div>
    </div>
  `;

  // Afficher la case scouts si statut = honneur
  setTimeout(() => {
    const sel = document.getElementById(`m${i}-statut`);
    sel.addEventListener("change", () => {
      const row = document.getElementById(`m${i}-scouts-row`);
      row.style.display = sel.value === "honneur" ? "block" : "none";
    });
  }, 0);

  return div;
}

function calculerScore() {
  const nb = parseInt(document.getElementById("eq-nb").value);
  if (!nb) return;

  let total = 0;
  for (let i = 1; i <= nb; i++) {
    const sel = document.getElementById(`m${i}-statut`);
    if (!sel) continue;
    const statut = STATUTS.find(s => s.val === sel.value);
    if (statut) total += statut.pts;
  }

  document.getElementById("score-val").textContent = total;

  // Couleur indicative
  const box = document.getElementById("score-box");
  box.style.borderLeft = total >= 10 ? "4px solid #2d9e4a" :
                         total >= 5  ? "4px solid #D2691E" :
                                       "4px solid #6c757d";
}

function collecterDonnees() {
  const nb = parseInt(document.getElementById("eq-nb").value);
  const membres = [];

  for (let i = 1; i <= nb; i++) {
    membres.push({
      prenom:  document.getElementById(`m${i}-prenom`).value.trim(),
      nom:     document.getElementById(`m${i}-nom`).value.trim(),
      email:   document.getElementById(`m${i}-email`).value.trim(),
      statut:  document.getElementById(`m${i}-statut`).value,
      scouts:  document.getElementById(`m${i}-scouts`) ? document.getElementById(`m${i}-scouts`).checked : false
    });
  }

  // Score total
  let score = 0;
  membres.forEach(m => {
    const s = STATUTS.find(st => st.val === m.statut);
    if (s) score += s.pts;
  });

  return {
    type:          "inscription",
    annee:         TREK_CONFIG.annee,
    equipe_nom:    document.getElementById("eq-nom").value.trim(),
    nb_membres:    nb,
    score:         score,
    membres:       membres,
    pref_diff:     document.getElementById("pref-diff").value,
    pref_region:   document.getElementById("pref-region").value,
    remarques:     document.getElementById("pref-remarques").value.trim(),
    resp_prenom:   document.getElementById("resp-prenom").value.trim(),
    resp_nom:      document.getElementById("resp-nom").value.trim(),
    resp_email:    document.getElementById("resp-email").value.trim(),
    resp_tel:      document.getElementById("resp-tel").value.trim(),
    timestamp:     new Date().toISOString()
  };
}

function validerFormulaire(data) {
  const nb = data.nb_membres;
  if (!data.equipe_nom) return "Le nom de l'équipe est obligatoire.";
  for (let i = 0; i < nb; i++) {
    const m = data.membres[i];
    if (!m.prenom || !m.nom || !m.email || !m.statut)
      return `Tous les champs du membre ${i + 1} sont obligatoires.`;
  }
  if (!data.resp_prenom || !data.resp_nom || !data.resp_email)
    return "Les coordonnées du responsable sont obligatoires.";
  if (!document.getElementById("accept-rgpd").checked)
    return "Veuillez accepter la déclaration de données.";
  return null;
}

function submitInscription(e) {
  e.preventDefault();

  const data = collecterDonnees();
  const erreur = validerFormulaire(data);

  if (erreur) {
    alert(erreur);
    return;
  }

  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "Envoi en cours…";

  fetch(TREK_CONFIG.apps_script_inscription, {
    method: "POST",
    mode:   "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:   "data=" + encodeURIComponent(JSON.stringify(data))
  })
  .then(() => {
    document.getElementById("form-inscription").style.display = "none";
    document.getElementById("inscription-success").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  })
  .catch(() => {
    btn.disabled = false;
    btn.textContent = "Envoyer l'inscription";
    alert("Erreur lors de l'envoi. Veuillez réessayer ou contacter " + TREK_CONFIG.email_contact);
  });
}
