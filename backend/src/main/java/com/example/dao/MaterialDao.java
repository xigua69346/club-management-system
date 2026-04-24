package com.example.dao;

import com.example.model.Material;
import java.util.List;

public interface MaterialDao {
    List<Material> getAllMaterials();
    Material getMaterialById(Integer id);
    void addMaterial(Material material);
    void updateMaterial(Material material);
    void deleteMaterial(Integer id);
    List<Material> getMaterialsByClub(String club);
    List<Material> getMaterialsByCategory(String category);
    List<Material> getMaterialsByUploader(String uploader);
}