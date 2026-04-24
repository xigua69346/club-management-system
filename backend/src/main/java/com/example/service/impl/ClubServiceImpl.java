package com.example.service.impl;

import com.example.dao.ClubDao;
import com.example.model.Club;
import com.example.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubServiceImpl implements ClubService {
    
    @Autowired
    private ClubDao clubDao;

    @Override
    public List<Club> getAllClubs() {
        return clubDao.getAllClubs();
    }

    @Override
    public Club getClubById(Integer id) {
        return clubDao.getClubById(id);
    }

    @Override
    public void addClub(Club club) {
        clubDao.addClub(club);
    }

    @Override
    public void updateClub(Club club) {
        clubDao.updateClub(club);
    }

    @Override
    public void deleteClub(Integer id) {
        clubDao.deleteClub(id);
    }

    @Override
    public List<Club> getClubsByStatus(String status) {
        return clubDao.getClubsByStatus(status);
    }

    @Override
    public List<Club> getClubsByCategory(String category) {
        return clubDao.getClubsByCategory(category);
    }
}