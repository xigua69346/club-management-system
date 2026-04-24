package com.example.controller;

import com.example.model.Activity;
import com.example.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/activity")
public class ActivityController {
    
    @Autowired
    private ActivityService activityService;

    @GetMapping("/list")
    @ResponseBody
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public Activity getActivityById(@PathVariable Integer id) {
        return activityService.getActivityById(id);
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addActivity(@RequestBody Activity activity) {
        Map<String, Object> result = new HashMap<>();
        try {
            activityService.addActivity(activity);
            result.put("success", true);
            result.put("message", "活动添加成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "活动添加失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/update")
    @ResponseBody
    public Map<String, Object> updateActivity(@RequestBody Activity activity) {
        Map<String, Object> result = new HashMap<>();
        try {
            activityService.updateActivity(activity);
            result.put("success", true);
            result.put("message", "活动更新成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "活动更新失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public Map<String, Object> deleteActivity(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            activityService.deleteActivity(id);
            result.put("success", true);
            result.put("message", "活动删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "活动删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/club/{club}")
    @ResponseBody
    public List<Activity> getActivitiesByClub(@PathVariable String club) {
        return activityService.getActivitiesByClub(club);
    }

    @GetMapping("/status/{status}")
    @ResponseBody
    public List<Activity> getActivitiesByStatus(@PathVariable String status) {
        return activityService.getActivitiesByStatus(status);
    }

    @GetMapping("/date-range")
    @ResponseBody
    public List<Activity> getActivitiesByDateRange(@RequestParam String startDate, @RequestParam String endDate) {
        return activityService.getActivitiesByDateRange(startDate, endDate);
    }
}