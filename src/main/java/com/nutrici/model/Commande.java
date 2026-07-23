package com.nutrici.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateCommande;
    private String statut;
    private float montantTotal;

    @ManyToOne
    private Client client;

    @OneToMany(mappedBy = "commande")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<LigneCommande> lignesCommande;
}
