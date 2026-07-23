let tousLesProduits = [];

document.addEventListener('DOMContentLoaded', async () => {
  await chargerCategories();
  await chargerProduits();

  document.getElementById('filtre-categorie').addEventListener('change', appliquerFiltre);
});

async function chargerCategories() {
  const select = document.getElementById('filtre-categorie');
  try {
    const categories = await getCategories();
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.libelle;
      select.appendChild(option);
    });
  } catch (erreur) {
    console.error('Impossible de charger les catégories :', erreur.message);
  }
}

async function chargerProduits() {
  const conteneur = document.getElementById('grille-produits');
  conteneur.innerHTML = '<p class="info">Chargement des produits...</p>';
  try {
    tousLesProduits = await getProduits();
    afficherProduits(tousLesProduits);
  } catch (erreur) {
    conteneur.innerHTML = `<p class="message message-erreur">Erreur : ${erreur.message}</p>`;
  }
}

function appliquerFiltre() {
  const idCategorie = document.getElementById('filtre-categorie').value;
  const produitsFiltres = idCategorie === 'toutes'
    ? tousLesProduits
    : tousLesProduits.filter(p => p.categorie && String(p.categorie.id) === idCategorie);
  afficherProduits(produitsFiltres);
}

function afficherProduits(produits) {
  const conteneur = document.getElementById('grille-produits');

  if (produits.length === 0) {
    conteneur.innerHTML = '<p class="info">Aucun produit dans cette catégorie.</p>';
    return;
  }

  conteneur.innerHTML = '';
  produits.forEach(produit => {
    const enRupture = produit.qteStock <= 0;

    const carte = document.createElement('article');
    carte.className = 'carte-produit';
    carte.innerHTML = `
      <p class="carte-produit__eyebrow">${produit.categorie?.libelle ?? 'Sans catégorie'}</p>
      <h3 class="carte-produit__nom">${produit.nom}</h3>
      <p class="carte-produit__description">${produit.description ?? ''}</p>
      <div class="carte-produit__ligne">
        <span>Prix</span>
        <span class="carte-produit__valeur">${produit.prixUnitaire.toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div class="carte-produit__ligne">
        <span>Stock disponible</span>
        <span class="carte-produit__valeur">${produit.qteStock}</span>
      </div>
      <button class="btn btn-primaire" ${enRupture ? 'disabled' : ''}>
        ${enRupture ? 'Rupture de stock' : 'Ajouter au panier'}
      </button>
    `;

    if (!enRupture) {
      carte.querySelector('button').addEventListener('click', () => ajouterAuPanier(produit));
    }

    conteneur.appendChild(carte);
  });
}

function ajouterAuPanier(produit) {
  const panier = JSON.parse(localStorage.getItem('nutrici_panier') || '[]');
  const ligneExistante = panier.find(l => l.produitId === produit.id);

  if (ligneExistante) {
    ligneExistante.quantite += 1;
  } else {
    panier.push({
      produitId: produit.id,
      nom: produit.nom,
      prixUnitaire: produit.prixUnitaire,
      quantite: 1,
    });
  }

  localStorage.setItem('nutrici_panier', JSON.stringify(panier));
  afficherClientEtPanier();
}