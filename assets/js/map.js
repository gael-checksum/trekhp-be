/**
 * Carte Leaflet + OSM — lieux d'arrivée Trek HP depuis 1958
 * Les coordonnées sont approximatives pour les régions connues.
 * Compléter la liste "arrivees" avec les données réelles des archives.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("map")) return;

  const map = L.map("map", {
    center: [50.15, 5.2],
    zoom: 8,
    scrollWheelZoom: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // -------------------------------------------------------------------
  // Lieux d'arrivée historiques — à compléter avec les données réelles
  // Format : [lat, lng, "Lieu", "année(s) ou période"]
  // -------------------------------------------------------------------
  const arrivees = [
    // Canton de l'Est / Hautes Fagnes
    [50.502, 6.097, "Malmedy", "Canton de l'Est"],
    [50.419, 6.119, "Stavelot", "Canton de l'Est"],
    [50.298, 6.109, "Vielsalm", "Canton de l'Est"],
    [50.563, 6.384, "Saint-Vith", "Canton de l'Est"],
    // Ardennes / Famenne
    [50.160, 5.576, "Rochefort", "Famenne"],
    [50.131, 5.189, "Redu", "Ardennes"],
    [50.230, 5.340, "Nassogne", "Famenne"],
    [50.114, 5.577, "Han-sur-Lesse", "Famenne"],
    [50.033, 5.446, "Tellin", "Ardennes"],
    [50.351, 5.262, "Marche-en-Famenne", "Famenne"],
    // Gaume / Province de Luxembourg
    [49.711, 5.325, "Virton", "Gaume"],
    [49.597, 5.499, "Florenville", "Gaume"],
    [49.660, 5.604, "Herbeumont", "Gaume"],
    [49.755, 5.606, "Habay-la-Neuve", "Forêt d'Anlier"],
    [49.841, 5.796, "Arlon", "Province de Luxembourg"],
    // Entre-Sambre-et-Meuse / Chimay
    [50.051, 4.311, "Chimay", "Entre-Sambre-et-Meuse"],
    [50.136, 4.550, "Philippeville", "Entre-Sambre-et-Meuse"],
    [50.203, 4.459, "Couvin", "Fagne"],
    // Condroz / Namur
    [50.471, 5.021, "Huy", "Condroz"],
    [50.357, 4.867, "Namur (env.)", "Condroz"],
    [50.263, 5.024, "Ciney", "Condroz"],
  ];

  // Icône personnalisée
  const iconArrivee = L.divIcon({
    className: "",
    html: '<div style="width:10px;height:10px;background:#8B4513;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  arrivees.forEach(function (a) {
    L.marker([a[0], a[1]], { icon: iconArrivee })
      .addTo(map)
      .bindPopup(
        "<strong>" + a[2] + "</strong><br><em>" + a[3] + "</em>"
      );
  });

  // Région 2027 si annoncée dans config.js
  if (TREK_CONFIG.region_2027) {
    L.polygon(TREK_CONFIG.region_2027.coords, {
      color: "#1a5e2a", fillColor: "#2d9e4a", fillOpacity: 0.4, weight: 2
    }).addTo(map).bindPopup(
      "<strong>" + TREK_CONFIG.region_2027.nom + "</strong><br><em>Région Trek HP 2027</em>"
    );
  }
});
