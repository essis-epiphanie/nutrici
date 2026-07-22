package com.nutrici.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantiteCommandee;
    private float prixFacture;

    @ManyToOne
    private Commande commande;

    @ManyToOne
    private Produit produit;
}