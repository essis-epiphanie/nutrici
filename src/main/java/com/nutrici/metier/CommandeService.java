package com.nutrici.metier;

import com.nutrici.constants.StatutCommande;
import com.nutrici.donnees.CommandeRepository;
import com.nutrici.donnees.LigneCommandeRepository;
import com.nutrici.donnees.ProduitRepository;
import com.nutrici.exception.ResourceNotFoundException;
import com.nutrici.exception.StockInsuffisantException;
import com.nutrici.model.Commande;
import com.nutrici.model.LigneCommande;
import com.nutrici.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    @Autowired
    private ProduitRepository produitRepository;

    // Récupérer toutes les commandes
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    // Récupérer une commande par son ID
    public Optional<Commande> getCommandeById(Long id) {
        return commandeRepository.findById(id);
    }

    // Sauvegarder une commande simple
    public Commande saveCommande(Commande commande) {
        if (commande.getDateCommande() == null) {
            commande.setDateCommande(LocalDateTime.now());
        }
        if (commande.getStatut() == null) {
            commande.setStatut(StatutCommande.EN_ATTENTE);
        }
        return commandeRepository.save(commande);
    }

    // Créer une commande avec ses lignes (avec vérification de stock)
    @Transactional
    public Commande creerCommande(Commande commande, List<LigneCommande> lignes) {
        // Vérifier le stock pour chaque produit
        for (LigneCommande ligne : lignes) {
            Produit produit = produitRepository.findById(ligne.getProduit().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé ID: " + ligne.getProduit().getId()));

            if (produit.getQteStock() < ligne.getQuantiteCommandee()) {
                throw new StockInsuffisantException("Stock insuffisant pour le produit: " + produit.getNom() + " (Stock: " + produit.getQteStock() + ", Demandé: " + ligne.getQuantiteCommandee() + ")");
            }
        }

        // Créer la commande
        commande.setDateCommande(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);
        Commande savedCommande = commandeRepository.save(commande);

        // Ajouter les lignes de commande et calculer le montant total
        float montantTotal = 0;
        for (LigneCommande ligne : lignes) {
            Produit produit = produitRepository.findById(ligne.getProduit().getId()).get();
            ligne.setCommande(savedCommande);
            ligne.setPrixFacture(produit.getPrixUnitaire() * ligne.getQuantiteCommandee());
            ligneCommandeRepository.save(ligne);
            montantTotal += ligne.getPrixFacture();

            // Diminuer le stock
            produit.setQteStock(produit.getQteStock() - ligne.getQuantiteCommandee());
            produitRepository.save(produit);
        }

        savedCommande.setMontantTotal(montantTotal);
        return commandeRepository.save(savedCommande);
    }

    // Payer une commande
    @Transactional
    public Commande payerCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée ID: " + id));

        if (!StatutCommande.EN_ATTENTE.equals(commande.getStatut())) {
            throw new RuntimeException("Cette commande ne peut pas être payée (Statut actuel: " + commande.getStatut() + ")");
        }

        commande.setStatut(StatutCommande.PAYEE);
        return commandeRepository.save(commande);
    }

    // Expédier une commande
    @Transactional
    public Commande expedierCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée ID: " + id));

        if (!StatutCommande.PAYEE.equals(commande.getStatut())) {
            throw new RuntimeException("La commande doit être payée avant d'être expédiée (Statut actuel: " + commande.getStatut() + ")");
        }

        commande.setStatut(StatutCommande.EXPEDIEE);
        return commandeRepository.save(commande);
    }

    // Récupérer les commandes d'un client
    public List<Commande> getCommandesByClient(Long clientId) {
        return commandeRepository.findAll()
                .stream()
                .filter(c -> c.getClient() != null && c.getClient().getId().equals(clientId))
                .collect(Collectors.toList());
    }

    // Supprimer une commande
    public void deleteCommande(Long id) {
        if (!commandeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Commande non trouvée ID: " + id);
        }
        commandeRepository.deleteById(id);
    }
}