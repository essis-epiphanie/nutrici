/*
   NutriCI — client API
   - /api/produits
   - /api/categories
   - /api/clients
   - /api/panier/*
    */

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

/* ---------- Produits ---------- */

async function getProduits() {
  const rep = await requeteApi('/produits');
  return rep.data;
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

/* ---------- Catégories ---------- */

async function getCategories() {
  return requeteApi('/categories');
}

async function creerCategorie(categorie) {
  return requeteApi('/categories', {
    method: 'POST',
    body: JSON.stringify(categorie),
  });
}

async function supprimerCategorie(id) {
  await requeteApi(`/categories/${id}`, { method: 'DELETE' });
}

/* ---------- Clients ---------- */

async function getClients() {
  return requeteApi('/clients');
}

async function creerClient(client) {
  return requeteApi('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
}

/* ---------- Panier / Commandes ---------- */

async function passerCommande(clientId, lignes) {
  return requeteApi('/panier/commander', {
    method: 'POST',
    body: JSON.stringify({ clientId, lignes }),
  });
}

async function payerCommande(commandeId) {
  return requeteApi(`/panier/payer/${commandeId}`, { method: 'POST' });
}

async function expedierCommande(commandeId) {
  return requeteApi(`/panier/expedier/${commandeId}`, { method: 'POST' });
}

async function getCommandesClient(clientId) {
  return requeteApi(`/panier/client/${clientId}`);
}