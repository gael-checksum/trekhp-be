/**
 * TREK HP — Google Apps Script
 * ==============================
 * Déployer via : script.google.com → Nouveau projet
 * Puis : Déployer → Nouvelle application web → "Tout le monde"
 * Copier l'URL dans config.js (apps_script_inscription et apps_script_mailing)
 *
 * Ce script écrit dans deux feuilles d'un même Google Spreadsheet :
 *   - "Inscriptions"  : les équipes avec leur score
 *   - "MailingList"   : les abonnés à la newsletter
 */

// ID du Google Spreadsheet (dans l'URL : /spreadsheets/d/VOTRE_ID/edit)
const SPREADSHEET_ID = "1LyC2nXXQUYnaT9pN9ZYQbzZafGNTEZWIzZPvyJB083w";

// E-mail de l'organisateur — reçoit une copie de chaque inscription
const EMAIL_ORGANISATEUR = "trekhp2027@gmail.com";

// ----------------------------------------------------------------

function doGet(e) {
  return ContentService
    .createTextOutput("Trek HP Apps Script OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const raw = (e.parameter && e.parameter.data)
      ? e.parameter.data
      : e.postData.contents;
    const data = JSON.parse(raw);

    if (data.type === "inscription") {
      traiterInscription(data);
    } else if (data.type === "mailing") {
      traiterMailing(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------------------
// INSCRIPTION ÉQUIPE
// ----------------------------------------------------------------
function traiterInscription(data) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName("Inscriptions");

  // Créer la feuille si elle n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet("Inscriptions");
    // En-têtes
    sheet.appendRow([
      "Timestamp", "Annee", "Equipe", "Nb membres", "Score priorite",
      "Statut liste",
      // Membres (6 max)
      "M1 Prénom","M1 Nom","M1 Email","M1 Statut","M1 Scouts",
      "M2 Prénom","M2 Nom","M2 Email","M2 Statut","M2 Scouts",
      "M3 Prénom","M3 Nom","M3 Email","M3 Statut","M3 Scouts",
      "M4 Prénom","M4 Nom","M4 Email","M4 Statut","M4 Scouts",
      "M5 Prénom","M5 Nom","M5 Email","M5 Statut","M5 Scouts",
      "M6 Prénom","M6 Nom","M6 Email","M6 Statut","M6 Scouts",
      // Prefs & responsable
      "Difficulté","Région préf.","Remarques",
      "Resp. Prénom","Resp. Nom","Resp. Email","Resp. Tel"
    ]);
    sheet.setFrozenRows(1);
    // Mise en forme de l'en-tête
    sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .setBackground("#1a5e2a").setFontColor("#ffffff").setFontWeight("bold");
  }

  // Construire la ligne
  const row = [
    data.timestamp, data.annee, data.equipe_nom, data.nb_membres, data.score,
    "En attente" // statut liste — à modifier manuellement
  ];

  for (let i = 0; i < 6; i++) {
    const m = data.membres[i];
    if (m) {
      row.push(m.prenom, m.nom, m.email, m.statut, m.scouts ? "Oui" : "Non");
    } else {
      row.push("", "", "", "", "");
    }
  }

  row.push(
    data.pref_diff, data.pref_region, data.remarques,
    data.resp_prenom, data.resp_nom, data.resp_email, data.resp_tel
  );

  sheet.appendRow(row);

  // Colorier la ligne selon le score
  const lastRow = sheet.getLastRow();
  const couleur = data.score >= 10 ? "#d4edda" :
                  data.score >= 5  ? "#fff3cd" : "#f8d7da";
  sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).setBackground(couleur);

  // Trier par score décroissant (colonne 5) après chaque inscription
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  range.sort({ column: 5, ascending: false });

  // Mail de notification à l'organisateur
  const sujet = "[Trek HP 2027] Nouvelle inscription : " + data.equipe_nom;
  const corps = `
Nouvelle inscription reçue pour le Trek HP 2027.

Équipe : ${data.equipe_nom}
Nombre de membres : ${data.nb_membres}
Score de priorité : ${data.score}

Responsable : ${data.resp_prenom} ${data.resp_nom} — ${data.resp_email}

Voir le tableau de bord :
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
  `.trim();

  MailApp.sendEmail(EMAIL_ORGANISATEUR, sujet, corps);

  // Accusé de réception au responsable
  const corpsMembre = `
Bonjour ${data.resp_prenom},

Nous avons bien reçu l'inscription de votre équipe « ${data.equipe_nom} » pour le Trek HP 2027.

Score de priorité calculé : ${data.score} point${data.score > 1 ? "s" : ""}

Nous confirmerons votre place (ou votre position sur liste d'attente) dans les prochains jours.

À bientôt sur les chemins de Wallonie !
L'équipe du Trek HP
  `.trim();

  MailApp.sendEmail(data.resp_email, "Trek HP 2027 — Inscription reçue", corpsMembre);
}

// ----------------------------------------------------------------
// MAILING LIST
// ----------------------------------------------------------------
function traiterMailing(data) {
  const ss  = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("MailingList");

  if (!sheet) {
    sheet = ss.insertSheet("MailingList");
    sheet.appendRow(["Timestamp","Prénom","Nom","Email"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 4)
      .setBackground("#1a5e2a").setFontColor("#ffffff").setFontWeight("bold");
  }

  // Vérifier les doublons par email
  const emails = sheet.getRange(2, 4, Math.max(sheet.getLastRow() - 1, 1), 1)
                      .getValues().flat();
  if (emails.includes(data.email)) return; // déjà inscrit

  sheet.appendRow([new Date().toISOString(), data.prenom, data.nom, data.email]);

  // Mail de bienvenue
  const corps = `
Bonjour ${data.prenom},

Vous êtes maintenant inscrit(e) sur la liste d'information du Trek HP 2027.

Vous recevrez toutes les actualités : annonces, ouverture des inscriptions,
informations pratiques, et résultats.

À bientôt !
L'équipe du Trek HP
  `.trim();

  MailApp.sendEmail(data.email, "Trek HP 2027 — Bienvenue sur la liste d'info !", corps);
}

// ----------------------------------------------------------------
// Fonction utilitaire pour tester depuis l'éditeur Apps Script
// ----------------------------------------------------------------
function testPost() {
  doPost({
    postData: {
      contents: JSON.stringify({
        type: "mailing",
        prenom: "Jean",
        nom: "Test",
        email: "jean.test@example.com"
      })
    }
  });
}
