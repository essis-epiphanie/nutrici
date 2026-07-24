// ============================================
// 🌿 NutriCI — Catalogue des produits
// ============================================
// Remarque : afficherClientEtPanier(), getProductImage(),
// showNotification() et formatPrice() sont déjà définies dans commun.js
// (chargé avant ce fichier), donc on ne les redéfinit pas ici.

let tousLesProduits = [];
let toutesLesCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
    await chargerProduits();
    remplirFiltreCategories();

    // Appliquer le filtre catégorie depuis l'URL (?cat=Vitamines)
    const params = new URLSearchParams(window.location.search);
    const catUrl = params.get('cat');
    if (catUrl) {
        const select = document.getElementById('filtre-categorie');
        const optionCorrespondante = Array.from(select.options)
            .find(o => o.textContent.trim().toLowerCase() === catUrl.trim().toLowerCase());
        if (optionCorrespondante) {
            select.value = optionCorrespondante.value;
        }
    }

    appliquerFiltres();

    document.getElementById('filtre-categorie').addEventListener('change', appliquerFiltres);
    document.getElementById('recherche-produit').addEventListener('input', appliquerFiltres);
});

// ---------- REMPLIR LE FILTRE AVEC LES CATÉGORIES PRÉSENTES DANS LE CATALOGUE ----------
function remplirFiltreCategories() {
    const select = document.getElementById('filtre-categorie');

    // On récupère uniquement les catégories des produits réellement affichés
    const categoriesPresentes = [...new Set(
        tousLesProduits
            .map(p => p.categorie?.libelle)
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, 'fr'));

    categoriesPresentes.forEach(libelle => {
        const option = document.createElement('option');
        option.value = libelle;
        option.textContent = libelle;
        select.appendChild(option);
    });
}

// ---------- CHARGER LES PRODUITS ----------
async function chargerProduits() {
    const grille = document.getElementById('grille-produits');
    try {
        tousLesProduits = await getProduits();
    } catch (erreur) {
        grille.innerHTML = `<p class="message message-erreur">❌ Erreur de chargement : ${erreur.message}</p>`;
        console.error('Erreur chargement produits:', erreur.message);
    }
}

// ---------- APPLIQUER LES FILTRES (catégorie + recherche) ----------
function appliquerFiltres() {
    const categorieChoisie = document.getElementById('filtre-categorie').value;
    const recherche = document.getElementById('recherche-produit').value.trim().toLowerCase();

    let produitsFiltres = tousLesProduits;

    if (categorieChoisie && categorieChoisie !== 'toutes') {
        produitsFiltres = produitsFiltres.filter(
            p => p.categorie?.libelle === categorieChoisie
        );
    }

    if (recherche) {
        produitsFiltres = produitsFiltres.filter(
            p => p.nom.toLowerCase().includes(recherche)
        );
    }

    afficherProduits(produitsFiltres);
}

// ---------- AFFICHER LES PRODUITS ----------
function afficherProduits(produits) {
    const grille = document.getElementById('grille-produits');
    const compteur = document.getElementById('compteur-produits');

    compteur.textContent = `${produits.length} produit${produits.length > 1 ? 's' : ''}`;

    if (produits.length === 0) {
        grille.innerHTML = '<p class="info">😕 Aucun produit trouvé.</p>';
        return;
    }

    grille.innerHTML = produits.map(p => `
        <div class="carte-produit">
            <img src="${getImageProduit(p)}" alt="${p.nom}"
                 style="width:100%;height:160px;object-fit:contain;background:#f5f5f5;border-radius:10px;"
                 onerror="this.onerror=null;this.style.display='none'">
            <h3>${p.nom}</h3>
            <p class="carte-produit__categorie">${p.categorie?.libelle || ''}</p>
            <p class="carte-produit__description">${p.description || ''}</p>
            <div class="carte-produit__bas">
                <strong>${formatPrice(p.prixUnitaire)}</strong>
                <button class="btn btn-primaire" ${p.qteStock <= 0 ? 'disabled' : ''}
                        onclick="ajouterAuPanier(${p.id}, '${p.nom.replace(/'/g, "\\'")}', ${p.prixUnitaire})">
                    ${p.qteStock <= 0 ? '❌ Rupture' : '🛒 Ajouter'}
                </button>
            </div>
        </div>
    `).join('');
}

// ---------- AJOUTER AU PANIER ----------
function ajouterAuPanier(produitId, nom, prixUnitaire) {
    const panier = JSON.parse(localStorage.getItem('nutrici_panier') || '[]');
    const ligneExistante = panier.find(l => l.produitId === produitId);

    if (ligneExistante) {
        ligneExistante.quantite += 1;
    } else {
        panier.push({ produitId, nom, prixUnitaire, quantite: 1 });
    }

    localStorage.setItem('nutrici_panier', JSON.stringify(panier));
    afficherClientEtPanier();
    showNotification(`✅ "${nom}" ajouté au panier`, 'success');
}