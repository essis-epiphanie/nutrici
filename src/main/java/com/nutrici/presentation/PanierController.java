package com.nutrici.presentation;

import com.nutrici.metier.CommandeService;      // ← IMPORT AJOUTÉ
import com.nutrici.model.Commande;
import com.nutrici.model.LigneCommande;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/panier")
public class PanierController {

    @Autowired
    private CommandeService commandeService;

    // Créer une commande avec les lignes de panier
    @PostMapping("/commander")
    public ResponseEntity<?> passerCommande(@RequestBody Map<String, Object> request) {
        try {
            // Récupérer le client ID
            Long clientId = Long.valueOf(request.get("clientId").toString());

            // Récupérer les lignes de commande
            List<Map<String, Object>> lignes = (List<Map<String, Object>>) request.get("lignes");

            Commande commande = new Commande();
            commande.setClient(new com.nutrici.model.Client());
            commande.getClient().setId(clientId);

            // Créer les lignes de commande
            List<LigneCommande> lignesCommande = new java.util.ArrayList<>();
            for (Map<String, Object> ligneData : lignes) {
                LigneCommande ligne = new LigneCommande();
                ligne.setProduit(new com.nutrici.model.Produit());
                ligne.getProduit().setId(Long.valueOf(ligneData.get("produitId").toString()));
                ligne.setQuantiteCommandee(Integer.valueOf(ligneData.get("quantite").toString()));
                lignesCommande.add(ligne);
            }

            Commande saved = commandeService.creerCommande(commande, lignesCommande);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erreur", e.getMessage()));
        }
    }

    // Payer une commande
    @PostMapping("/payer/{commandeId}")
    public ResponseEntity<?> payerCommande(@PathVariable Long commandeId) {
        try {
            Commande commande = commandeService.payerCommande(commandeId);
            return ResponseEntity.ok(commande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erreur", e.getMessage()));
        }
    }

    // Expédier une commande (admin)
    @PostMapping("/expedier/{commandeId}")
    public ResponseEntity<?> expedierCommande(@PathVariable Long commandeId) {
        try {
            Commande commande = commandeService.expedierCommande(commandeId);
            return ResponseEntity.ok(commande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erreur", e.getMessage()));
        }
    }

    // Voir les commandes d'un client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getCommandesByClient(@PathVariable Long clientId) {
        List<Commande> commandes = commandeService.getAllCommandes()
                .stream()
                .filter(c -> c.getClient().getId().equals(clientId))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(commandes);
    }
}