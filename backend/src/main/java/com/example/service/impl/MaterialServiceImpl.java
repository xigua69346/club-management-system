package com.example.service.impl;

import com.example.dao.MaterialDao;
import com.example.model.Material;
import com.example.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService {
    
    @Autowired
    private MaterialDao materialDao;

    @Override
    public List<Material> getAllMaterials() {
        return materialDao.getAllMaterials();
    }

    @Override
    public Material getMaterialById(Integer id) {
        return materialDao.getMaterialById(id);
    }

    @Override
    public void addMaterial(Material material) {
        materialDao.addMaterial(material);
    }

    @Override
    public void updateMaterial(Material material) {
        materialDao.updateMaterial(material);
    }

    @Override
    public void deleteMaterial(Integer id) {
        materialDao.deleteMaterial(id);
    }

    @Override
    public List<Material> getMaterialsByClub(String club) {
        return materialDao.getMaterialsByClub(club);
    }

    @Override
    public List<Material> getMaterialsByCategory(String category) {
        return materialDao.getMaterialsByCategory(category);
    }

    @Override
    public List<Material> getMaterialsByUploader(String uploader) {
        return materialDao.getMaterialsByUploader(uploader);
    }
}