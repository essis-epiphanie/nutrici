// ============================================
// NutriCI — Admin (Prix en FCFA)
// ============================================

let produitEnModification = null;

document.addEventListener('DOMContentLoaded', () => {
    chargerCategoriesSelect();
    chargerProduitsAdmin();
    chargerCategoriesAdmin();
    chargerCommandesAdmin();

    document.getElementById('form-produit').addEventListener('submit', async (e) => {
        e.preventDefault();
        await enregistrerProduit();
    });

    document.getElementById('form-categorie').addEventListener('submit', async (e) => {
        e.preventDefault();
        await enregistrerCategorie();
    });
});

async function chargerProduitsAdmin() {
    const tbody = document.getElementById('tbody-produits');
    tbody.innerHTML = '<tr><td colspan="6">⏳ Chargement...</td></tr>';

    try {
        const produits = await getProduits();
        if (produits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Aucun produit</td></tr>';
            return;
        }

        tbody.innerHTML = produits.map(p => `
            <tr>
                <td>${p.reference || 'N/A'}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <img src="${getImageProduit(p)}" alt="${p.nom}"
                             style="width:30px;height:30px;object-fit:contain;border-radius:6px;background:#f5f5f5;"
                             onerror="this.onerror=null;this.style.display='none'">
                        ${p.nom}
                    </div>
                </td>
                <td>${p.categorie?.libelle || 'N/A'}</td>
                <td>${p.prixUnitaire.toLocaleString('fr-FR')} FCFA</td>
                <td>${p.qteStock}</td>
                <td>
                    <button class="btn btn-primaire" style="padding:0.2rem 0.6rem;font-size:0.75rem;" onclick="editerProduit(${p.id})">✏️</button>
                    <button class="btn btn-texte" style="padding:0.2rem 0.6rem;font-size:0.75rem;color:var(--rouge-alerte);" onclick="supprimerProduitAdmin(${p.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (erreur) {
        tbody.innerHTML = `<tr><td colspan="6">❌ ${erreur.message}</td></tr>`;
    }
}

function editerProduit(id) {
    const tbody = document.getElementById('tbody-produits');
    const row = tbody.querySelector(`button[onclick*="editerProduit(${id})"]`)?.closest('tr');
    if (!row) return;

    const cells = row.querySelectorAll('td');
    const nom = cells[1]?.textContent?.trim() || '';
    const prix = parseFloat(cells[3]?.textContent?.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
    const stock = parseInt(cells[4]?.textContent) || 0;

    produitEnModification = id;
    document.getElementById('titre-form-produit').textContent = '✏️ Modifier le produit';

    document.getElementById('produit-id').value = id;
    document.getElementById('produit-reference').value = '';
    document.getElementById('produit-nom').value = nom;
    document.getElementById('produit-description').value = '';
    document.getElementById('produit-prix').value = prix;
    document.getElementById('produit-stock').value = stock;

    document.getElementById('message-produit').textContent = '';
    document.getElementById('message-produit').className = '';
}

async function enregistrerProduit() {
    const zoneMessage = document.getElementById('message-produit');
    zoneMessage.textContent = '';
    zoneMessage.className = '';

    const id = document.getElementById('produit-id').value;
    const produit = {
        reference: document.getElementById('produit-reference').value.trim() || `PROD${Date.now()}`,
        nom: document.getElementById('produit-nom').value.trim(),
        description: document.getElementById('produit-description').value.trim(),
        prixUnitaire: parseFloat(document.getElementById('produit-prix').value),
        qteStock: parseInt(document.getElementById('produit-stock').value),
        categorie: {
            id: parseInt(document.getElementById('produit-categorie').value) || null
        }
    };

    if (!produit.nom) {
        zoneMessage.textContent = 'Le nom est requis';
        zoneMessage.className = 'message message-erreur';
        return;
    }

    try {
        if (id) {
            await modifierProduit(parseInt(id), produit);
            zoneMessage.textContent = '✅ Produit modifié avec succès';
            document.getElementById('titre-form-produit').textContent = '➕ Ajouter un produit';
            document.getElementById('produit-id').value = '';
        } else {
            await creerProduit(produit);
            zoneMessage.textContent = '✅ Produit créé avec succès';
        }

        zoneMessage.className = 'message message-succes';
        document.getElementById('form-produit').reset();
        produitEnModification = null;
        chargerProduitsAdmin();
    } catch (erreur) {
        zoneMessage.textContent = `❌ Erreur : ${erreur.message}`;
        zoneMessage.className = 'message message-erreur';
    }
}

async function supprimerProduitAdmin(id) {
    if (!confirm('Supprimer ce produit ?')) return;

    try {
        await supprimerProduit(id);
        chargerProduitsAdmin();
        const zoneMessage = document.getElementById('message-produit');
        zoneMessage.textContent = '✅ Produit supprimé';
        zoneMessage.className = 'message message-succes';
    } catch (erreur) {
        const zoneMessage = document.getElementById('message-produit');
        zoneMessage.textContent = `❌ Erreur : ${erreur.message}`;
        zoneMessage.className = 'message message-erreur';
    }
}

async function chargerCategoriesSelect() {
    const select = document.getElementById('produit-categorie');
    try {
        const categories = await getCategories();
        select.innerHTML = '<option value="">Sélectionner...</option>' +
            categories.map(c => `<option value="${c.id}">${c.libelle}</option>`).join('');
    } catch (erreur) {
        console.error('Erreur chargement catégories:', erreur.message);
    }
}

async function chargerCategoriesAdmin() {
    const liste = document.getElementById('liste-categories');
    try {
        const categories = await getCategories();
        if (categories.length === 0) {
            liste.innerHTML = '<li>Aucune catégorie</li>';
            return;
        }
        liste.innerHTML = categories.map(c =>
            `<li>
                <span>${c.libelle} (${c.code})</span>
                <button class="btn btn-texte" style="color:var(--rouge-alerte);" onclick="supprimerCategorieAdmin(${c.id})">✕</button>
            </li>`
        ).join('');
    } catch (erreur) {
        liste.innerHTML = `<li>❌ ${erreur.message}</li>`;
    }
}

async function enregistrerCategorie() {
    const code = document.getElementById('categorie-code').value.trim();
    const libelle = document.getElementById('categorie-libelle').value.trim();

    if (!code || !libelle) {
        alert('Code et libellé sont requis');
        return;
    }

    try {
        await creerCategorie({ code, libelle });
        document.getElementById('form-categorie').reset();
        chargerCategoriesAdmin();
        chargerCategoriesSelect();
        alert('✅ Catégorie créée avec succès');
    } catch (erreur) {
        alert(`❌ Erreur : ${erreur.message}`);
    }
}

async function supprimerCategorieAdmin(id) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
        await supprimerCategorie(id);
        chargerCategoriesAdmin();
        chargerCategoriesSelect();
        alert('✅ Catégorie supprimée');
    } catch (erreur) {
        alert(`❌ Erreur : ${erreur.message}`);
    }
}

async function chargerCommandesAdmin() {
    const container = document.getElementById('liste-commandes-admin');
    if (!container) return;

    container.innerHTML = '<p class="info">⏳ Chargement des commandes...</p>';

    try {
        const clients = await getClients();
        let toutesCommandes = [];

        for (const client of clients) {
            try {
                const commandes = await getCommandesClient(client.id);
                if (commandes && commandes.length > 0) {
                    toutesCommandes = toutesCommandes.concat(commandes.map(c => ({
                        ...c,
                        clientNom: `${client.prenom} ${client.nom}`
                    })));
                }
            } catch (e) {}
        }

        toutesCommandes.sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande));

        if (toutesCommandes.length === 0) {
            container.innerHTML = '<p class="info">Aucune commande</p>';
            return;
        }

        container.innerHTML = toutesCommandes.map(c => `
            <div style="border:1px solid var(--rayure);border-radius:10px;padding:0.8rem;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.3rem;">
                    <div>
                        <strong>#${c.id}</strong>
                        <span style="font-size:0.8rem;color:var(--encre-douce);">
                            — ${c.clientNom || 'Client inconnu'}
                        </span>
                    </div>
                    <span class="badge badge-${c.statut?.toLowerCase() || 'en_attente'}">
                        ${libelleStatutAdmin(c.statut)}
                    </span>
                </div>
                <p style="font-size:0.85rem;color:var(--encre-douce);margin:0.3rem 0;">
                    ${new Date(c.dateCommande).toLocaleString('fr-FR')} —
                    <strong>${c.montantTotal.toLocaleString('fr-FR')} FCFA</strong>
                </p>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.3rem;">
                    ${c.statut === 'EN_ATTENTE' ?
                        `<button class="btn btn-primaire" style="padding:0.2rem 0.8rem;font-size:0.75rem;" onclick="payerCommandeAdmin(${c.id})">💰 Payer</button>` :
                        ''}
                    ${c.statut === 'PAYEE' ?
                        `<button class="btn btn-primaire" style="padding:0.2rem 0.8rem;font-size:0.75rem;" onclick="expedierCommandeAdmin(${c.id})">📦 Expédier</button>` :
                        ''}
                    ${c.statut === 'EXPEDIEE' ?
                        `<span style="font-size:0.85rem;color:var(--encre-douce);">✅ Livrée</span>` :
                        ''}
                </div>
            </div>
        `).join('');
    } catch (erreur) {
        container.innerHTML = `<p class="message message-erreur">❌ ${erreur.message}</p>`;
    }
}

async function payerCommandeAdmin(id) {
    try {
        await payerCommande(id);
        chargerCommandesAdmin();
        alert('✅ Commande payée');
    } catch (erreur) {
        alert(`❌ Erreur : ${erreur.message}`);
    }
}

async function expedierCommandeAdmin(id) {
    try {
        await expedierCommande(id);
        chargerCommandesAdmin();
        alert('✅ Commande expédiée');
    } catch (erreur) {
        alert(`❌ Erreur : ${erreur.message}`);
    }
}

function libelleStatutAdmin(statut) {
    const libelles = {
        EN_ATTENTE: '⏳ En attente',
        PAYEE: '✅ Payée',
        EXPEDIEE: '📦 Expédiée'
    };
    return libelles[statut] || statut;
}