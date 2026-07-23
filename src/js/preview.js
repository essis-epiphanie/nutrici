/* Affiche le client identifié et le nombre d'articles du panier dans l'en-tête.
   Appelé sur chaque page qui inclut #zone-client / #compteur-panier. */
function afficherClientEtPanier() {
  const client = JSON.parse(localStorage.getItem('nutrici_client') || 'null');
  const panier = JSON.parse(localStorage.getItem('nutrici_panier') || '[]');

  const zoneClient = document.getElementById('zone-client');
  if (zoneClient) {
    zoneClient.textContent = client ? `${client.prenom} ${client.nom}` : 'Non identifié';
  }

  const compteurPanier = document.getElementById('compteur-panier');
  if (compteurPanier) {
    const total = panier.reduce((somme, ligne) => somme + ligne.quantite, 0);
    compteurPanier.textContent = total;
  }
}

document.addEventListener('DOMContentLoaded', afficherClientEtPanier);