// ============================================
// NutriCI — Identification
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1) ATTACHER LE FORMULAIRE EN PREMIER ----------
    // Ainsi, même si le pré-remplissage plus bas plante,
    // le bouton "S'identifier" fonctionne toujours.
    document.getElementById('form-identification').addEventListener('submit', async (e) => {
        e.preventDefault();
        const zoneMessage = document.getElementById('message');
        zoneMessage.textContent = '';
        zoneMessage.className = '';

        const email = document.getElementById('email').value.trim();
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const adresse = document.getElementById('adresse').value.trim();

        if (!email || !nom || !prenom) {
            zoneMessage.textContent = '⚠️ Email, nom et prénom sont requis';
            zoneMessage.className = 'message message-erreur';
            return;
        }

        try {
            // Chercher si le client existe déjà
            const clients = await getClients();
            let client = clients.find(c => c.email?.toLowerCase() === email.toLowerCase());

            if (client) {
                // Mise à jour des champs vides
                client.nom = nom || client.nom;
                client.prenom = prenom || client.prenom;
                client.telephone = telephone || client.telephone;
                client.adresse = adresse || client.adresse;
            } else {
                // Créer un nouveau client
                client = await creerClient({
                    nom,
                    prenom,
                    email,
                    telephone: telephone || '',
                    adresse: adresse || ''
                });
            }

            if (!client) {
                throw new Error("Le serveur n'a renvoyé aucune donnée client.");
            }

            localStorage.setItem('nutrici_client', JSON.stringify(client));
            zoneMessage.textContent = '✅ Identification réussie ! Redirection...';
            zoneMessage.className = 'message message-succes';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (erreur) {
            console.error('❌ Erreur identification:', erreur);
            zoneMessage.textContent = `❌ Erreur : ${erreur.message}`;
            zoneMessage.className = 'message message-erreur';
        }
    });

    // ---------- 2) BOUTON DÉCONNEXION ----------
    const boutonDeconnexion = document.getElementById('btn-deconnexion');
    boutonDeconnexion.addEventListener('click', () => {
        if (confirm('Se déconnecter ?')) {
            localStorage.removeItem('nutrici_client');
            window.location.reload();
        }
    });

    // ---------- 3) PRÉ-REMPLISSAGE SI DÉJÀ IDENTIFIÉ (non bloquant) ----------
    try {
        // Filet de sécurité si lireLocalStorage n'est pas chargé (commun.js manquant/ordre incorrect)
        const lireStockage = typeof lireLocalStorage === 'function'
            ? lireLocalStorage
            : (cle, defaut) => {
                const brut = localStorage.getItem(cle);
                if (!brut || brut === 'undefined') return defaut;
                try { return JSON.parse(brut); } catch { return defaut; }
            };

        const clientExistant = lireStockage('nutrici_client', null);
        const zoneClientActuel = document.getElementById('client-actuel');

        if (clientExistant) {
            zoneClientActuel.textContent = `✅ Identifié en tant que ${clientExistant.prenom} ${clientExistant.nom} (${clientExistant.email})`;
            zoneClientActuel.style.display = 'block';
            boutonDeconnexion.style.display = 'inline-block';

            document.getElementById('email').value = clientExistant.email || '';
            document.getElementById('nom').value = clientExistant.nom || '';
            document.getElementById('prenom').value = clientExistant.prenom || '';
            document.getElementById('telephone').value = clientExistant.telephone || '';
            document.getElementById('adresse').value = clientExistant.adresse || '';
        }
    } catch (erreur) {
        console.error('❌ Erreur pré-remplissage identification:', erreur);
    }
});