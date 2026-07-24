package com.nutrici.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reference;
    private String nom;
    private float prixUnitaire;
    private int qteStock;
    private String description;
    private String image;  // ← NOUVEAU CHAMP POUR L'IMAGE

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
}