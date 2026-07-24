// ============================================
// NutriCI — Mes commandes (Prix en FCFA)
// ============================================

document.addEventListener('DOMContentLoaded', chargerCommandes);

async function chargerCommandes() {
    const conteneur = document.getElementById('liste-commandes');
    const client = JSON.parse(localStorage.getItem('nutrici_client') || 'null');

    if (!client) {
        conteneur.innerHTML = `
            <div class="message message-erreur">
                ⚠️ Identifiez-vous pour voir vos commandes.
            </div>
            <a href="identification.html" class="btn btn-primaire" style="width:auto;">🔑 S'identifier</a>
        `;
        return;
    }

    conteneur.innerHTML = '<p class="info">⏳ Chargement de vos commandes...</p>';

    try {
        const commandes = await getCommandesClient(client.id);

        if (commandes.length === 0) {
            conteneur.innerHTML = `
                <p class="info">📦 Aucune commande pour le moment.</p>
                <a href="catalogue.html" class="btn btn-primaire" style="width:auto;">🛍️ Découvrir les produits</a>
            `;
            return;
        }

        // Statistiques
        const total = commandes.length;
        const enAttente = commandes.filter(c => c.statut === 'EN_ATTENTE').length;
        const payees = commandes.filter(c => c.statut === 'PAYEE').length;
        const expediees = commandes.filter(c => c.statut === 'EXPEDIEE').length;

        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-grid';
        statsDiv.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color:#B76E0A;">${enAttente}</div>
                <div class="stat-label">En attente</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color:#065F46;">${payees}</div>
                <div class="stat-label">Payées</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color:#1A4A7A;">${expediees}</div>
                <div class="stat-label">Expédiées</div>
            </div>
        `;
        conteneur.prepend(statsDiv);

        const listDiv = document.createElement('div');
        commandes
            .slice()
            .sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande))
            .forEach(commande => {
                const carte = document.createElement('div');
                carte.className = 'carte-commande';
                carte.innerHTML = `
                    <div class="carte-commande__entete">
                        <span>Commande n°${commande.id}</span>
                        <span class="badge badge-${commande.statut?.toLowerCase() || 'en_attente'}">
                            ${libelleStatut(commande.statut)}
                        </span>
                    </div>
                    <p>📅 ${new Date(commande.dateCommande).toLocaleString('fr-FR')}</p>
                    <p>💰 <strong>${commande.montantTotal.toLocaleString('fr-FR')} FCFA</strong></p>
                    ${commande.statut === 'EN_ATTENTE' ?
                        `<button class="btn btn-primaire" data-id="${commande.id}" style="width:auto;">💰 Payer maintenant</button>` :
                        ''}
                `;

                const boutonPayer = carte.querySelector('button');
                if (boutonPayer) {
                    boutonPayer.addEventListener('click', async () => {
                        try {
                            await payerCommande(commande.id);
                            chargerCommandes();
                        } catch (erreur) {
                            alert(`❌ Erreur : ${erreur.message}`);
                        }
                    });
                }

                listDiv.appendChild(carte);
            });
        conteneur.appendChild(listDiv);

    } catch (erreur) {
        conteneur.innerHTML = `<p class="message message-erreur">❌ Erreur : ${erreur.message}</p>`;
    }
}

function libelleStatut(statut) {
    const libelles = {
        EN_ATTENTE: '⏳ En attente de paiement',
        PAYEE: '✅ Payée',
        EXPEDIEE: '📦 Expédiée'
    };
    return libelles[statut] ?? statut;
}