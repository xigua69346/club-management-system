package com.example.dao;

import com.example.model.Activity;
import java.util.List;

public interface ActivityDao {
    List<Activity> getAllActivities();
    Activity getActivityById(Integer id);
    void addActivity(Activity activity);
    void updateActivity(Activity activity);
    void deleteActivity(Integer id);
    List<Activity> getActivitiesByClub(String club);
    List<Activity> getActivitiesByStatus(String status);
    List<Activity> getActivitiesByDateRange(String startDate, String endDate);
}