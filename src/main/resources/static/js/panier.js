// ============================================
// NutriCI — Panier (Prix en FCFA)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    afficherPanier();
    document.getElementById('btn-valider').addEventListener('click', validerCommande);
});

// ---------- LIRE / ÉCRIRE PANIER ----------
function lirePanier() {
    return lireLocalStorage('nutrici_panier', []);
}

function ecrirePanier(panier) {
    localStorage.setItem('nutrici_panier', JSON.stringify(panier));
    afficherClientEtPanier();
}

// ---------- AFFICHER PANIER ----------
function afficherPanier() {
    const panier = lirePanier();
    const conteneur = document.getElementById('lignes-panier');
    const zoneTotal = document.getElementById('total-panier');
    const boutonValider = document.getElementById('btn-valider');
    const zoneMessage = document.getElementById('message');
    const zoneConfirmation = document.getElementById('zone-confirmation');

    if (zoneConfirmation) zoneConfirmation.innerHTML = '';
    if (zoneMessage) {
        zoneMessage.textContent = '';
        zoneMessage.className = '';
    }

    if (panier.length === 0) {
        conteneur.innerHTML = `
            <div style="text-align:center;padding:2rem 0;">
                <div style="font-size:3rem;">🛒</div>
                <p style="color:var(--encre-douce);">Votre panier est vide</p>
                <a href="catalogue.html" class="btn btn-primaire" style="width:auto;">🛍️ Découvrir les produits</a>
            </div>
        `;
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
            <span class="ligne-panier__nom">
                <span style="font-size:1.2rem;">${getProductImage(ligne.nom) ? '🖼️' : '🌿'}</span>
                ${ligne.nom}
            </span>
            <input type="number" min="1" value="${ligne.quantite}" class="ligne-panier__quantite" data-index="${index}">
            <span class="ligne-panier__prix">${sousTotal.toLocaleString('fr-FR')} FCFA</span>
            <button class="btn btn-texte" style="color:var(--rouge-alerte);" data-index="${index}">🗑️ Retirer</button>
        `;
        conteneur.appendChild(div);
    });

    zoneTotal.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
    boutonValider.disabled = false;

    conteneur.querySelectorAll('.ligne-panier__quantite').forEach(input => {
        input.addEventListener('change', (e) => {
            const panierActuel = lirePanier();
            const index = Number(e.target.dataset.index);
            const nouvelleQuantite = Math.max(1, Number(e.target.value));
            panierActuel[index].quantite = nouvelleQuantite;
            ecrirePanier(panierActuel);
            afficherPanier();
        });
    });

    conteneur.querySelectorAll('.btn-texte').forEach(bouton => {
        bouton.addEventListener('click', (e) => {
            const panierActuel = lirePanier();
            const index = Number(e.target.dataset.index);
            const nom = panierActuel[index].nom;
            if (confirm(`Retirer "${nom}" du panier ?`)) {
                panierActuel.splice(index, 1);
                ecrirePanier(panierActuel);
                afficherPanier();
            }
        });
    });
}

// ---------- VALIDER COMMANDE ----------
async function validerCommande() {
    const zoneMessage = document.getElementById('message');
    const zoneConfirmation = document.getElementById('zone-confirmation');
    zoneMessage.textContent = '';
    zoneMessage.className = '';
    zoneConfirmation.innerHTML = '';

    const client = lireLocalStorage('nutrici_client', null);
    if (!client) {
        zoneMessage.textContent = '⚠️ Veuillez vous identifier avant de commander.';
        zoneMessage.className = 'message message-erreur';
        return;
    }

    const panier = lirePanier();
    if (panier.length === 0) {
        zoneMessage.textContent = '⚠️ Votre panier est vide';
        zoneMessage.className = 'message message-erreur';
        return;
    }

    const lignes = panier.map(l => ({ produitId: l.produitId, quantite: l.quantite }));

    try {
        const commande = await passerCommande(client.id, lignes);

        if (!commande || !commande.id) {
            throw new Error("Le serveur n'a renvoyé aucune commande valide.");
        }

        localStorage.removeItem('nutrici_panier');
        afficherClientEtPanier();
        afficherPanier();

        zoneConfirmation.innerHTML = `
            <div class="message message-succes" style="margin-top:1rem;">
                ✅ Commande n°${commande.id} créée avec succès —
                total : <strong>${commande.montantTotal.toLocaleString('fr-FR')} FCFA</strong>
            </div>
            <button class="btn btn-primaire" id="btn-payer" style="margin-top:0.8rem;">
                💰 Payer maintenant
            </button>
            <a href="mes-commandes.html" class="btn btn-texte">📦 Voir mes commandes</a>
        `;

        document.getElementById('btn-payer').addEventListener('click', async () => {
            try {
                await payerCommande(commande.id);
                zoneConfirmation.innerHTML = `
                    <div class="message message-succes">
                        💰 Commande #${commande.id} payée avec succès !
                    </div>
                    <a href="mes-commandes.html" class="btn btn-primaire">📦 Voir mes commandes</a>
                `;
            } catch (erreurPaiement) {
                zoneMessage.textContent = `❌ Erreur lors du paiement : ${erreurPaiement.message}`;
                zoneMessage.className = 'message message-erreur';
            }
        });
    } catch (erreur) {
        zoneMessage.textContent = `❌ Erreur : ${erreur.message}`;
        zoneMessage.className = 'message message-erreur';
    }
}