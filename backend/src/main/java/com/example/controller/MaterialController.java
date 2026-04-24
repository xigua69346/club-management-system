package com.example.controller;

import com.example.model.Material;
import com.example.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/material")
public class MaterialController {
    
    @Autowired
    private MaterialService materialService;

    @GetMapping("/list")
    @ResponseBody
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public Material getMaterialById(@PathVariable Integer id) {
        return materialService.getMaterialById(id);
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addMaterial(@RequestBody Material material) {
        Map<String, Object> result = new HashMap<>();
        try {
            materialService.addMaterial(material);
            result.put("success", true);
            result.put("message", "资料添加成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "资料添加失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/update")
    @ResponseBody
    public Map<String, Object> updateMaterial(@RequestBody Material material) {
        Map<String, Object> result = new HashMap<>();
        try {
            materialService.updateMaterial(material);
            result.put("success", true);
            result.put("message", "资料更新成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "资料更新失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public Map<String, Object> deleteMaterial(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            materialService.deleteMaterial(id);
            result.put("success", true);
            result.put("message", "资料删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "资料删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/club/{club}")
    @ResponseBody
    public List<Material> getMaterialsByClub(@PathVariable String club) {
        return materialService.getMaterialsByClub(club);
    }

    @GetMapping("/category/{category}")
    @ResponseBody
    public List<Material> getMaterialsByCategory(@PathVariable String category) {
        return materialService.getMaterialsByCategory(category);
    }

    @GetMapping("/uploader/{uploader}")
    @ResponseBody
    public List<Material> getMaterialsByUploader(@PathVariable String uploader) {
        return materialService.getMaterialsByUploader(uploader);
    }
}