package com.nutrici.presentation;

import com.nutrici.metier.CategorieService;
import com.nutrici.model.Categorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {
    @Autowired
    private CategorieService categorieService;

    @GetMapping
    public List<Categorie> getAllCategories() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        return categorieService.getCategorieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categorie> createCategorie(@RequestBody Categorie categorie) {
        Categorie saved = categorieService.saveCategorie(categorie);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        if (categorieService.getCategorieById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        categorie.setId(id);
        return ResponseEntity.ok(categorieService.saveCategorie(categorie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        if (categorieService.getCategorieById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
}