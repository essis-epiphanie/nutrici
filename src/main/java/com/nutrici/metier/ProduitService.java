package com.nutrici.metier;

import com.nutrici.donnees.ProduitRepository;
import com.nutrici.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    // Récupérer tous les produits
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    // Récupérer un produit par son ID
    public Optional<Produit> getProduitById(Long id) {
        return produitRepository.findById(id);
    }

    // Sauvegarder un produit (création ou modification)
    public Produit saveProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    // Supprimer un produit par son ID
    public void deleteProduit(Long id) {
        produitRepository.deleteById(id);
    }

    // Vérifier si un produit existe
    public boolean existsById(Long id) {
        return produitRepository.existsById(id);
    }
}