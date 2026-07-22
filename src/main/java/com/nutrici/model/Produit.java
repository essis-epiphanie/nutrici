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

    @ManyToOne
    private Categorie categorie;
}