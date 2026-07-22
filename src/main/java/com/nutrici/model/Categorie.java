package com.nutrici.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String libelle;
}