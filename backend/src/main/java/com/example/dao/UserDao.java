package com.example.dao;

import com.example.model.User;

public interface UserDao {
    User login(String username, String password);
    User getUserById(Integer id);
    void addUser(User user);
    void updateUser(User user);
    void deleteUser(Integer id);
}