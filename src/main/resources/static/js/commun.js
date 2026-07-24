// ============================================
// 🌿 NutriCI — Fonctions partagées (CORRIGÉ)
// ============================================

// ---------- LECTURE SÛRE DU LOCALSTORAGE ----------
// Évite le crash "undefined" is not valid JSON si une valeur
// a été stockée par erreur avec setItem(cle, undefined)
function lireLocalStorage(cle, valeurParDefaut) {
    const brut = localStorage.getItem(cle);
    if (brut === null || brut === undefined || brut === 'undefined' || brut === '') {
        return valeurParDefaut;
    }
    try {
        return JSON.parse(brut);
    } catch (error) {
        console.warn(`⚠️ Valeur corrompue pour "${cle}", réinitialisation.`, error);
        localStorage.removeItem(cle);
        return valeurParDefaut;
    }
}

// ---------- AFFICHAGE CLIENT ET PANIER ----------
function afficherClientEtPanier() {
    try {
        const client = lireLocalStorage('nutrici_client', null);
        const panier = lireLocalStorage('nutrici_panier', []);

        const zoneClient = document.getElementById('zone-client');
        if (zoneClient) {
            zoneClient.textContent = client ? `${client.prenom} ${client.nom}` : 'Non identifié';
        }

        const compteurPanier = document.getElementById('compteur-panier');
        if (compteurPanier) {
            const total = panier.reduce((somme, ligne) => somme + ligne.quantite, 0);
            compteurPanier.textContent = total;
        }
    } catch (error) {
        console.error('❌ Erreur affichage client/panier:', error);
    }
}

// ---------- IMAGE DEPUIS LA BASE DE DONNÉES (PRIORITAIRE) ----------
// Utilise la colonne "image" du produit si elle existe, sinon devine via le nom
function getImageProduit(produit) {
    const base = '/frontend/images/';
    if (produit && produit.image) {
        return base + produit.image;
    }
    return getProductImage(produit ? produit.nom : '');
}

// ---------- MAP DES IMAGES (DEVINETTE PAR LE NOM — UTILISÉE EN SECOURS) ----------
function getProductImage(nom) {
    const base = '/frontend/images/';

    const imageMap = {
        // ---- PRODUITS SPÉCIFIQUES ----
        'aura': 'auraZen.jpg',
        'aura zen': 'auraZen.jpg',
        'collagen': 'collagen.jpg',
        'collagène': 'collagen.jpg',
        'forever': 'forevervision.jpg',
        'humeur': 'humeur.jpg',
        'keratine': 'keratine.jpg',
        'kérative': 'keratine.jpg',
        'kératine': 'keratine.jpg',
        'magnesium': 'magnesium.jpg',
        'magnésium': 'magnesium.jpg',
        'nitrico': 'nitrico.jpg',
        'omega': 'omega3.jpg',
        'omega-3': 'omega3.jpg',
        'oméga': 'omega3.jpg',
        'oméga-3': 'omega3.jpg',
        'probiotique': 'probiotique.jpg',
        'sommeil': 'sommeil.jpg',
        'terravita': 'terravita.jpg',
        'spiruline': 'spiruline.jpg',
        'vitamine a': 'vitamineA.jpg',
        'vitamine c': 'vitamineC.jpg',
        'vitamine': 'vitamineC.jpg',
        'vitamine d': 'vitaminD.jpg',
        'multibon': 'multibon.jpg',
        'vitalite': 'vitalite.jpg',
        'parapharmacie': 'parapharmacie.jpg',
        'bion3': 'bion3.jpg',
        'vitamint': 'vitamint.jpg',
        'zinc': 'zinc.jpg',
        'granions': 'granions.jpg'
    };

    const name = (nom || '').toLowerCase().trim();

    for (const [key, file] of Object.entries(imageMap)) {
        if (name.includes(key)) {
            return base + file;
        }
    }

    // Image par défaut
    return base + 'default.jpg';
}

// ---------- NOTIFICATIONS ----------
function showNotification(message, type = 'success') {
    try {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed; top: 80px; right: 20px; z-index: 9999;
                display: flex; flex-direction: column; gap: 10px;
                max-width: 380px; width: 100%;
            `;
            document.body.prepend(container);
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            padding: 12px 16px; border-radius: 10px; font-weight: 500;
            font-size: 0.9rem; animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border-left: 4px solid transparent;
        `;

        const colors = {
            success: { background: '#D1FAE5', color: '#065F46', border: '#10B981' },
            danger: { background: '#FEE2E2', color: '#991B1B', border: '#EF4444' },
            info: { background: '#DBEAFE', color: '#1E40AF', border: '#3B82F6' },
            warning: { background: '#FEF3C7', color: '#92400E', border: '#F59E0B' }
        };
        const style = colors[type] || colors.success;
        alert.style.background = style.background;
        alert.style.color = style.color;
        alert.style.borderLeftColor = style.border;

        container.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    } catch (error) {
        console.error('❌ Erreur notification:', error);
    }
}

// ---------- FORMATER LE PRIX ----------
function formatPrice(prix) {
    return prix.toLocaleString('fr-FR') + ' FCFA';
}

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ commun.js chargé');
    afficherClientEtPanier();

    window.addEventListener('storage', function(e) {
        if (e.key === 'nutrici_panier' || e.key === 'nutrici_client') {
            afficherClientEtPanier();
        }
    });
});

// ---------- AJOUTER LES ANIMATIONS ----------
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();