package com.nutrici.presentation;

import com.nutrici.dto.ApiResponse;
import com.nutrici.exception.ResourceNotFoundException;
import com.nutrici.metier.ProduitService;
import com.nutrici.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    // GET : Récupérer tous les produits
    @GetMapping
    public ResponseEntity<ApiResponse> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return ResponseEntity.ok(new ApiResponse(200, "Succès", produits));
    }

    // GET : Récupérer un produit par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProduitById(@PathVariable Long id) {
        Produit produit = produitService.getProduitById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé ID: " + id));
        return ResponseEntity.ok(new ApiResponse(200, "Succès", produit));
    }

    // POST : Créer un produit
    @PostMapping
    public ResponseEntity<ApiResponse> createProduit(@RequestBody Produit produit) {
        Produit saved = produitService.saveProduit(produit);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(201, "Produit créé avec succès", saved));
    }

    // PUT : Modifier un produit
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        if (!produitService.existsById(id)) {
            throw new ResourceNotFoundException("Produit non trouvé ID: " + id);
        }
        produit.setId(id);
        Produit updated = produitService.saveProduit(produit);
        return ResponseEntity.ok(new ApiResponse(200, "Produit modifié avec succès", updated));
    }

    // DELETE : Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduit(@PathVariable Long id) {
        if (!produitService.existsById(id)) {
            throw new ResourceNotFoundException("Produit non trouvé ID: " + id);
        }
        produitService.deleteProduit(id);
        return ResponseEntity.ok(new ApiResponse(200, "Produit supprimé avec succès", null));
    }
}