document.addEventListener('DOMContentLoaded', chargerCommandes);

async function chargerCommandes() {
  const conteneur = document.getElementById('liste-commandes');
  const client = JSON.parse(localStorage.getItem('nutrici_client') || 'null');

  if (!client) {
    conteneur.innerHTML = '<p class="info">Identifiez-vous pour voir vos commandes.</p>';
    return;
  }

  conteneur.innerHTML = '<p class="info">Chargement...</p>';

  try {
    const commandes = await getCommandesClient(client.id);

    if (commandes.length === 0) {
      conteneur.innerHTML = '<p class="info">Aucune commande pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = '';
    commandes
      .slice()
      .sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande))
      .forEach(commande => {
        const carte = document.createElement('div');
        carte.className = 'carte-commande';
        carte.innerHTML = `
          <div class="carte-commande__entete">
            <span>Commande n°${commande.id}</span>
            <span class="badge badge-${commande.statut.toLowerCase()}">${libelleStatut(commande.statut)}</span>
          </div>
          <p>Date : ${new Date(commande.dateCommande).toLocaleString('fr-FR')}</p>
          <p>Total : ${commande.montantTotal.toLocaleString('fr-FR')} FCFA</p>
          ${commande.statut === 'EN_ATTENTE' ? `<button class="btn btn-primaire" data-id="${commande.id}">Payer</button>` : ''}
        `;

        const boutonPayer = carte.querySelector('button');
        if (boutonPayer) {
          boutonPayer.addEventListener('click', async () => {
            try {
              await payerCommande(commande.id);
              chargerCommandes();
            } catch (erreur) {
              alert(`Erreur : ${erreur.message}`);
            }
          });
        }

        conteneur.appendChild(carte);
      });
  } catch (erreur) {
    conteneur.innerHTML = `<p class="message message-erreur">Erreur : ${erreur.message}</p>`;
  }
}

function libelleStatut(statut) {
  const libelles = {
    EN_ATTENTE: 'En attente de paiement',
    PAYEE: 'Payée',
    EXPEDIEE: 'Expédiée',
  };
  return libelles[statut] ?? statut;
}