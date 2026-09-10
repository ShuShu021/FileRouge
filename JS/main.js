import { pays } from "./data.js";
import { creerCarte } from "./ui.js";

const conteneurResultats = document.querySelector("#resultats");
const statut = document.querySelector("#resultats [role='status']");
const selectRegion = document.querySelector("#filtre-region");
const detail = document.querySelector("#detail");

function afficherCartes(liste) {
  document
    .querySelectorAll("#resultats article")
    .forEach((carte) => carte.remove());

  const fragment = document.createDocumentFragment();
  liste.forEach((unPays) => {
    fragment.appendChild(creerCarte(unPays));
  });
  conteneurResultats.appendChild(fragment);

  statut.textContent = `${liste.length} pays affiché(s).`;
}

afficherCartes(pays);

selectRegion.addEventListener("change", () => {
  const regionChoisie = selectRegion.value;

  const listeFiltree =
    regionChoisie === "toutes"
      ? pays
      : pays.filter((p) => p.region === regionChoisie);

  afficherCartes(listeFiltree);
});

conteneurResultats.addEventListener("click", (evenement) => {
  const carte = evenement.target.closest("article");
  if (!carte) return;

  const paysClique = pays.find((p) => p.code === carte.dataset.code);
  if (paysClique) {
    detail.textContent = `${paysClique.nom} — Capitale : ${paysClique.capitale}, Région : ${paysClique.region}, Population : ${paysClique.population.toLocaleString("fr-FR")}`;
  }
});
