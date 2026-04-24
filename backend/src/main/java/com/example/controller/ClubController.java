package com.example.controller;

import com.example.model.Club;
import com.example.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/club")
public class ClubController {
    
    @Autowired
    private ClubService clubService;

    @GetMapping("/list")
    @ResponseBody
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public Club getClubById(@PathVariable Integer id) {
        return clubService.getClubById(id);
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addClub(@RequestBody Club club) {
        Map<String, Object> result = new HashMap<>();
        try {
            clubService.addClub(club);
            result.put("success", true);
            result.put("message", "社团添加成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "社团添加失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/update")
    @ResponseBody
    public Map<String, Object> updateClub(@RequestBody Club club) {
        Map<String, Object> result = new HashMap<>();
        try {
            clubService.updateClub(club);
            result.put("success", true);
            result.put("message", "社团更新成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "社团更新失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public Map<String, Object> deleteClub(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            clubService.deleteClub(id);
            result.put("success", true);
            result.put("message", "社团删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "社团删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/status/{status}")
    @ResponseBody
    public List<Club> getClubsByStatus(@PathVariable String status) {
        return clubService.getClubsByStatus(status);
    }

    @GetMapping("/category/{category}")
    @ResponseBody
    public List<Club> getClubsByCategory(@PathVariable String category) {
        return clubService.getClubsByCategory(category);
    }
}