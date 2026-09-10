import { pays } from "./data.js";
import { creerCarte } from "./ui.js";

const conteneurResultats = document.querySelector("#resultats");
const statut = document.querySelector("#resultats [role='status']");
const selectRegion = document.querySelector("#filtre-region");
const detail = document.querySelector("#detail");
const formulaire = document.querySelector("#recherche form");
const champRecherche = document.querySelector("#pays");

let listeActuelle = [];

function viderResultats() {
  document
    .querySelectorAll("#resultats article")
    .forEach((carte) => carte.remove());
  document.querySelector("#resultats .bouton-reessayer")?.remove();
}

function afficherChargement() {
  viderResultats();
  statut.textContent = "Chargement en cours…";
}

function afficherSucces(liste) {
  viderResultats();
  listeActuelle = liste;

  const fragment = document.createDocumentFragment();
  liste.forEach((unPays) => fragment.appendChild(creerCarte(unPays)));
  conteneurResultats.appendChild(fragment);

  statut.textContent = `${liste.length} pays affiché(s).`;
}

function afficherVide() {
  viderResultats();
  listeActuelle = [];
  statut.textContent = "Aucun pays trouvé.";
}

function afficherErreur(recharger) {
  viderResultats();
  listeActuelle = [];
  statut.textContent = "Une erreur est survenue. Vérifie ta connexion.";

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = "Réessayer";
  bouton.className = "bouton-reessayer";
  bouton.addEventListener("click", recharger);

  conteneurResultats.appendChild(bouton);
}

async function chargerEtAfficher(fonctionApi) {
  afficherChargement();
  try {
    const liste = await fonctionApi();
    if (liste.length === 0) {
      afficherVide();
    } else {
      afficherSucces(liste);
    }
  } catch (erreur) {
    console.error(erreur);
    afficherErreur(() => chargerEtAfficher(fonctionApi));
  }
}

function rechercherDansLesPays(nom) {
  const terme = nom.trim().toLocaleLowerCase("fr-FR");

  return pays.filter((unPays) =>
    unPays.nom.toLocaleLowerCase("fr-FR").includes(terme),
  );
}

function filtrerParRegion(region) {
  if (region === "toutes") {
    return pays;
  }

  return pays.filter((unPays) => unPays.region === region);
}

afficherSucces(pays);

selectRegion.addEventListener("change", () => {
  const regionChoisie = selectRegion.value;
  const resultats = filtrerParRegion(regionChoisie);
  resultats.length === 0 ? afficherVide() : afficherSucces(resultats);
});

let minuteur = null;

function lancerRechercheAvecDebounce() {
  clearTimeout(minuteur);

  minuteur = setTimeout(() => {
    const nom = champRecherche.value.trim();

    if (nom === "") {
      afficherSucces(pays);
      return;
    }

    const resultats = rechercherDansLesPays(nom);
    resultats.length === 0 ? afficherVide() : afficherSucces(resultats);
  }, 300);
}

champRecherche.addEventListener("input", lancerRechercheAvecDebounce);

formulaire.addEventListener("submit", (evenement) => {
  evenement.preventDefault();
  clearTimeout(minuteur);
  const nom = champRecherche.value.trim();
  if (nom !== "") {
    const resultats = rechercherDansLesPays(nom);
    resultats.length === 0 ? afficherVide() : afficherSucces(resultats);
  }
});
conteneurResultats.addEventListener("click", (evenement) => {
  const carte = evenement.target.closest("article");
  if (!carte) return;

  const paysClique = listeActuelle.find((p) => p.code === carte.dataset.code);
  if (paysClique) {
    detail.textContent = `${paysClique.nom} — Capitale : ${paysClique.capitale}, Région : ${paysClique.region}, Population : ${paysClique.population.toLocaleString("fr-FR")}`;
  }
});
