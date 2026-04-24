package com.example.dao;

import com.example.model.Club;
import java.util.List;

public interface ClubDao {
    List<Club> getAllClubs();
    Club getClubById(Integer id);
    void addClub(Club club);
    void updateClub(Club club);
    void deleteClub(Integer id);
    List<Club> getClubsByStatus(String status);
    List<Club> getClubsByCategory(String category);
}