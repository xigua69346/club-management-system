package com.example.dao;

import com.example.model.Member;
import java.util.List;

public interface MemberDao {
    List<Member> getAllMembers();
    Member getMemberById(String id);
    void addMember(Member member);
    void updateMember(Member member);
    void deleteMember(String id);
    List<Member> getMembersByClub(String club);
    List<Member> getMembersByStatus(String status);
    List<Member> getMembersByRole(String role);
}