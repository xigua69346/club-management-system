package com.example.service;

import com.example.model.User;

public interface UserService {
    User login(String username, String password);
    User getUserById(Integer id);
    void addUser(User user);
    void updateUser(User user);
    void deleteUser(Integer id);
}