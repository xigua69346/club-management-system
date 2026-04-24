package com.example.controller;

import com.example.model.Member;
import com.example.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/member")
public class MemberController {
    
    @Autowired
    private MemberService memberService;

    @GetMapping("/list")
    @ResponseBody
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public Member getMemberById(@PathVariable String id) {
        return memberService.getMemberById(id);
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addMember(@RequestBody Member member) {
        Map<String, Object> result = new HashMap<>();
        try {
            memberService.addMember(member);
            result.put("success", true);
            result.put("message", "成员添加成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "成员添加失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/update")
    @ResponseBody
    public Map<String, Object> updateMember(@RequestBody Member member) {
        Map<String, Object> result = new HashMap<>();
        try {
            memberService.updateMember(member);
            result.put("success", true);
            result.put("message", "成员更新成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "成员更新失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public Map<String, Object> deleteMember(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            memberService.deleteMember(id);
            result.put("success", true);
            result.put("message", "成员删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "成员删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/club/{club}")
    @ResponseBody
    public List<Member> getMembersByClub(@PathVariable String club) {
        return memberService.getMembersByClub(club);
    }

    @GetMapping("/status/{status}")
    @ResponseBody
    public List<Member> getMembersByStatus(@PathVariable String status) {
        return memberService.getMembersByStatus(status);
    }

    @GetMapping("/role/{role}")
    @ResponseBody
    public List<Member> getMembersByRole(@PathVariable String role) {
        return memberService.getMembersByRole(role);
    }
}