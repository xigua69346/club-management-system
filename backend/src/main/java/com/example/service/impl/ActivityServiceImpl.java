package com.example.service.impl;

import com.example.dao.ActivityDao;
import com.example.model.Activity;
import com.example.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {
    
    @Autowired
    private ActivityDao activityDao;

    @Override
    public List<Activity> getAllActivities() {
        return activityDao.getAllActivities();
    }

    @Override
    public Activity getActivityById(Integer id) {
        return activityDao.getActivityById(id);
    }

    @Override
    public void addActivity(Activity activity) {
        activityDao.addActivity(activity);
    }

    @Override
    public void updateActivity(Activity activity) {
        activityDao.updateActivity(activity);
    }

    @Override
    public void deleteActivity(Integer id) {
        activityDao.deleteActivity(id);
    }

    @Override
    public List<Activity> getActivitiesByClub(String club) {
        return activityDao.getActivitiesByClub(club);
    }

    @Override
    public List<Activity> getActivitiesByStatus(String status) {
        return activityDao.getActivitiesByStatus(status);
    }

    @Override
    public List<Activity> getActivitiesByDateRange(String startDate, String endDate) {
        return activityDao.getActivitiesByDateRange(startDate, endDate);
    }
}