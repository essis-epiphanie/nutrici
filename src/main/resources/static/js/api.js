// ============================================
// NutriCI — Client API
// ============================================
const API_BASE = 'http://localhost:8080/api';

async function requeteApi(endpoint, options = {}) {
    const reponse = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const texte = await reponse.text();
    const corps = texte ? JSON.parse(texte) : null;

    if (!reponse.ok) {
        const message = corps?.message || corps?.erreur || `Erreur ${reponse.status}`;
        throw new Error(message);
    }

    return corps;
}

// ---------- Produits ----------
async function getProduits() {
    const rep = await requeteApi('/produits');
    return rep.data || rep;
}

async function getProduit(id) {
    const rep = await requeteApi(`/produits/${id}`);
    return rep.data;
}

async function creerProduit(produit) {
    const rep = await requeteApi('/produits', {
        method: 'POST',
        body: JSON.stringify(produit),
    });
    return rep.data;
}

async function modifierProduit(id, produit) {
    const rep = await requeteApi(`/produits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(produit),
    });
    return rep.data;
}

async function supprimerProduit(id) {
    await requeteApi(`/produits/${id}`, { method: 'DELETE' });
}

// ---------- Catégories ----------
async function getCategories() {
    const rep = await requeteApi('/categories');
    return rep.data || rep;
}

async function creerCategorie(categorie) {
    const rep = await requeteApi('/categories', {
        method: 'POST',
        body: JSON.stringify(categorie),
    });
    return rep.data || rep;
}

async function supprimerCategorie(id) {
    await requeteApi(`/categories/${id}`, { method: 'DELETE' });
}

// ---------- Clients ----------
async function getClients() {
    const rep = await requeteApi('/clients');
    return rep.data || rep;
}

async function creerClient(client) {
    const rep = await requeteApi('/clients', {
        method: 'POST',
        body: JSON.stringify(client),
    });
    return rep.data || rep;
}

// ---------- Commandes ----------
async function passerCommande(clientId, lignes) {
    const rep = await requeteApi('/panier/commander', {
        method: 'POST',
        body: JSON.stringify({ clientId, lignes }),
    });
    return rep.data || rep;
}

async function payerCommande(commandeId) {
    const rep = await requeteApi(`/panier/payer/${commandeId}`, {
        method: 'POST',
    });
    return rep.data || rep;
}

async function expedierCommande(commandeId) {
    const rep = await requeteApi(`/panier/expedier/${commandeId}`, {
        method: 'POST',
    });
    return rep.data || rep;
}

async function getCommandesClient(clientId) {
    const rep = await requeteApi(`/panier/client/${clientId}`);
    return rep.data || rep;
}