package com.example.service.impl;

import com.example.dao.MemberDao;
import com.example.model.Member;
import com.example.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {
    
    @Autowired
    private MemberDao memberDao;

    @Override
    public List<Member> getAllMembers() {
        return memberDao.getAllMembers();
    }

    @Override
    public Member getMemberById(String id) {
        return memberDao.getMemberById(id);
    }

    @Override
    public void addMember(Member member) {
        memberDao.addMember(member);
    }

    @Override
    public void updateMember(Member member) {
        memberDao.updateMember(member);
    }

    @Override
    public void deleteMember(String id) {
        memberDao.deleteMember(id);
    }

    @Override
    public List<Member> getMembersByClub(String club) {
        return memberDao.getMembersByClub(club);
    }

    @Override
    public List<Member> getMembersByStatus(String status) {
        return memberDao.getMembersByStatus(status);
    }

    @Override
    public List<Member> getMembersByRole(String role) {
        return memberDao.getMembersByRole(role);
    }
}