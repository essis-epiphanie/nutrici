document.addEventListener('DOMContentLoaded', () => {
  afficherPanier();
  document.getElementById('btn-valider').addEventListener('click', validerCommande);
});

function lirePanier() {
  return JSON.parse(localStorage.getItem('nutrici_panier') || '[]');
}

function ecrirePanier(panier) {
  localStorage.setItem('nutrici_panier', JSON.stringify(panier));
  afficherClientEtPanier();
}

function afficherPanier() {
  const panier = lirePanier();
  const conteneur = document.getElementById('lignes-panier');
  const zoneTotal = document.getElementById('total-panier');
  const boutonValider = document.getElementById('btn-valider');

  if (panier.length === 0) {
    conteneur.innerHTML = '<p class="info">Votre panier est vide.</p>';
    zoneTotal.textContent = '0 FCFA';
    boutonValider.disabled = true;
    return;
  }

  conteneur.innerHTML = '';
  let total = 0;

  panier.forEach((ligne, index) => {
    const sousTotal = ligne.prixUnitaire * ligne.quantite;
    total += sousTotal;

    const div = document.createElement('div');
    div.className = 'ligne-panier';
    div.innerHTML = `
      <span class="ligne-panier__nom">${ligne.nom}</span>
      <input type="number" min="1" value="${ligne.quantite}" class="ligne-panier__quantite" data-index="${index}">
      <span class="ligne-panier__prix">${sousTotal.toLocaleString('fr-FR')} FCFA</span>
      <button class="btn btn-texte" data-index="${index}">Retirer</button>
    `;
    conteneur.appendChild(div);
  });

  zoneTotal.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
  boutonValider.disabled = false;

  conteneur.querySelectorAll('.ligne-panier__quantite').forEach(input => {
    input.addEventListener('change', (e) => {
      const panierActuel = lirePanier();
      const index = Number(e.target.dataset.index);
      panierActuel[index].quantite = Math.max(1, Number(e.target.value));
      ecrirePanier(panierActuel);
      afficherPanier();
    });
  });

  conteneur.querySelectorAll('.btn-texte').forEach(bouton => {
    bouton.addEventListener('click', (e) => {
      const panierActuel = lirePanier();
      const index = Number(e.target.dataset.index);
      panierActuel.splice(index, 1);
      ecrirePanier(panierActuel);
      afficherPanier();
    });
  });
}

async function validerCommande() {
  const zoneMessage = document.getElementById('message');
  zoneMessage.textContent = '';
  zoneMessage.className = '';

  const client = JSON.parse(localStorage.getItem('nutrici_client') || 'null');
  if (!client) {
    zoneMessage.textContent = 'Veuillez vous identifier avant de commander.';
    zoneMessage.className = 'message message-erreur';
    return;
  }

  const panier = lirePanier();
  const lignes = panier.map(l => ({ produitId: l.produitId, quantite: l.quantite }));

  try {
    const commande = await passerCommande(client.id, lignes);
    localStorage.removeItem('nutrici_panier');
    afficherClientEtPanier();
    afficherPanier();

    document.getElementById('zone-confirmation').innerHTML = `
      <p class="message message-succes">
        Commande n°${commande.id} créée avec succès — total : ${commande.montantTotal.toLocaleString('fr-FR')} FCFA
      </p>
      <button class="btn btn-primaire" id="btn-payer">Payer maintenant</button>
    `;

    document.getElementById('btn-payer').addEventListener('click', async () => {
      try {
        await payerCommande(commande.id);
        window.location.href = 'mes-commandes.html';
      } catch (erreurPaiement) {
        zoneMessage.textContent = `Erreur lors du paiement : ${erreurPaiement.message}`;
        zoneMessage.className = 'message message-erreur';
      }
    });
  } catch (erreur) {
    zoneMessage.textContent = `Erreur : ${erreur.message}`;
    zoneMessage.className = 'message message-erreur';
  }
}