/**
 * CONFIG TREK HP — modifier ce fichier chaque année
 * ===================================================
 */
const TREK_CONFIG = {
  annee: 2027,

  // Date cible pour le compte à rebours (format ISO)
  date_trek: "2027-10-15T08:00:00",

  // Statut : "annonce" | "inscriptions_ouvertes" | "liste_attente" | "complet" | "passe"
  statut: "annonce",

  // Capacité
  max_participants: 180,
  equipe_min: 4,
  equipe_max: 6,

  // Région 2027 (null = pas encore annoncé)
  region_2027: null,

  // Contact
  email_contact: "trekhp2027@gmail.com",

  // Backend Google Apps Script (URL du déploiement)
  // Remplacer par l'URL de votre Apps Script une fois déployé
  apps_script_inscription: "https://script.google.com/macros/s/1G-JWHOFX44Se87V0MC0QLcbAAsMow6TXC79MkPA_GC01GZhWML-ClOAd/exec",
  apps_script_mailing: "https://script.google.com/macros/s/1LyC2nXXQUYnaT9pN9ZYQbzZafGNTEZWIzZPvyJB083w/exec",

  // Système de priorité (points par membre)
  priorite: {
    groupe_honneur: 3,   // membre actif Groupe Honneur (inscrit scouts)
    veteran: 2,          // 5 participations ou plus
    ancien: 1,           // 1 à 3 participations
    nouveau: 0           // première participation
  }
};
