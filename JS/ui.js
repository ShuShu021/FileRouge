export function creerCarte(pays) {
  const article = document.createElement("article");
  article.dataset.code = pays.code;
  article.tabIndex = 0;

  const titre = document.createElement("h3");
  titre.textContent = pays.nom;

  const capitale = document.createElement("p");
  capitale.textContent = `Capitale : ${pays.capitale}`;

  const region = document.createElement("p");
  region.textContent = `Région : ${pays.region}`;

  const population = document.createElement("p");
  population.textContent = `Population : ${pays.population.toLocaleString("fr-FR")}`;

  article.append(titre, capitale, region, population);

  return article;
}
