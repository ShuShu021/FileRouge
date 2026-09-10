const BASE_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
let cachePays = null;

function normaliserPays(pays) {
  return {
    nom: pays.name?.common ?? "Nom inconnu",
    capitale: pays.capital?.[0] ?? "Capitale inconnue",
    region: pays.region ?? "Région inconnue",
    population: pays.population ?? 0,
    code: pays.cca2 ?? "??",
  };
}

async function appelerApi(url) {
  const reponse = await fetch(url);

  if (!reponse.ok) {
    if (reponse.status === 404) {
      return [];
    }
    throw new Error(`Erreur API : ${reponse.status}`);
  }

  const donnees = await reponse.json();
  return donnees.map(normaliserPays);
}

function chargerPays() {
  if (cachePays === null) {
    cachePays = appelerApi(BASE_URL).catch((erreur) => {
      cachePays = null;
      throw erreur;
    });
  }

  return cachePays;
}

export async function chercherPays(nom) {
  const terme = nom.trim().toLocaleLowerCase("fr-FR");
  const pays = await chargerPays();

  return pays.filter((paysActuel) =>
    paysActuel.nom.toLocaleLowerCase("fr-FR").includes(terme),
  );
}

export async function chercherRegion(region) {
  const pays = await chargerPays();
  const regionRecherchee = region.trim().toLocaleLowerCase("fr-FR");

  return pays.filter(
    (paysActuel) =>
      paysActuel.region.toLocaleLowerCase("fr-FR") === regionRecherchee,
  );
}

export function chercherTous() {
  return chargerPays();
}
