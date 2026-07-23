document.addEventListener('DOMContentLoaded', () => {
  const clientExistant = JSON.parse(localStorage.getItem('nutrici_client') || 'null');
  const zoneClientActuel = document.getElementById('client-actuel');
  const boutonDeconnexion = document.getElementById('btn-deconnexion');

  if (clientExistant) {
    zoneClientActuel.textContent = `Identifié en tant que ${clientExistant.prenom} ${clientExistant.nom} (${clientExistant.email})`;
    zoneClientActuel.style.display = 'block';
    boutonDeconnexion.style.display = 'inline-block';
  }

  boutonDeconnexion.addEventListener('click', () => {
    localStorage.removeItem('nutrici_client');
    window.location.reload();
  });

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

    try {
      // On cherche si un client avec cet email existe déjà
      const clients = await getClients();
      let client = clients.find(c => c.email?.toLowerCase() === email.toLowerCase());

      // Sinon on le crée
      if (!client) {
        client = await creerClient({ nom, prenom, email, telephone, adresse });
      }

      localStorage.setItem('nutrici_client', JSON.stringify(client));
      window.location.href = 'index.html';
    } catch (erreur) {
      zoneMessage.textContent = `Erreur : ${erreur.message}`;
      zoneMessage.className = 'message message-erreur';
    }
  });
});