// ============================================
// NutriCI — Index (Page d'accueil)
// ============================================

let tousLesProduits = [];

document.addEventListener('DOMContentLoaded', async () => {
    await chargerProduitsAccueil();
    await chargerCategoriesAccueil();
});

// ---------- CHARGER PRODUITS ----------
async function chargerProduitsAccueil() {
    try {
        const produits = await getProduits();
        tousLesProduits = produits || [];

        const totalProduits = document.getElementById('totalProduits');
        if (totalProduits) {
            totalProduits.textContent = tousLesProduits.length;
        }
    } catch (erreur) {
        console.error('Erreur chargement produits:', erreur.message);
    }
}

// ---------- CHARGER CATÉGORIES ----------
async function chargerCategoriesAccueil() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    try {
        const categories = await getCategories();

        const icons = {
            'Vitamines': '💊',
            'Minéraux': '🧂',
            'Protéines': '💪',
            'Oméga-3': '🐟',
            'Plantes': '🌿'
        };

        const counts = {};
        (tousLesProduits || []).forEach(p => {
            const cat = p.categorie?.libelle || 'Autre';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        grid.innerHTML = categories.map(c => `
            <div class="category-card" onclick="window.location.href='catalogue.html?cat=${encodeURIComponent(c.libelle)}'">
                <div class="cat-icon">${icons[c.libelle] || '📂'}</div>
                <div class="cat-name">${c.libelle}</div>
                <div class="cat-count">${counts[c.libelle] || 0} produits</div>
            </div>
        `).join('') + `
            <div class="category-card" onclick="window.location.href='catalogue.html'">
                <div class="cat-icon">🔄</div>
                <div class="cat-name">Tous</div>
                <div class="cat-count">${tousLesProduits?.length || 0} produits</div>
            </div>
        `;
    } catch (erreur) {
        console.error('Erreur chargement catégories:', erreur.message);
        grid.innerHTML = `<p class="message message-erreur">❌ ${erreur.message}</p>`;
    }
}