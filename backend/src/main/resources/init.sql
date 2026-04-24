-- 创建数据库
CREATE DATABASE IF NOT EXISTS college_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE college_club;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin, advisor, leader, member
    name VARCHAR(50) NOT NULL,
    contact VARCHAR(100)
);

-- 创建社团表
CREATE TABLE IF NOT EXISTS club (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    leader VARCHAR(50) NOT NULL,
    leader_contact VARCHAR(100),
    advisor VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- normal, pending, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建成员表
CREATE TABLE IF NOT EXISTS member (
    id VARCHAR(20) PRIMARY KEY, -- 学号
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    major VARCHAR(100) NOT NULL,
    club VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- leader, core, member
    contact VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- normal, pending, left
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建活动表
CREATE TABLE IF NOT EXISTS activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    club VARCHAR(100) NOT NULL,
    leader VARCHAR(50) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    budget DOUBLE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, ended
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建资料表
CREATE TABLE IF NOT EXISTS material (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    club VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploader VARCHAR(50) NOT NULL,
    description TEXT,
    size BIGINT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建活动签到表
CREATE TABLE IF NOT EXISTS activity_sign_in (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    sign_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activity(id),
    FOREIGN KEY (member_id) REFERENCES member(id)
);

-- 插入初始数据
-- 插入用户数据
INSERT INTO user (username, password, role, name, contact) VALUES
('admin', '123456', 'admin', '系统管理员', 'admin@example.com'),
('advisor1', '123456', 'advisor', '李老师', 'advisor1@example.com'),
('leader1', '123456', 'leader', '张三', 'leader1@example.com'),
('member1', '123456', 'member', '李四', 'member1@example.com');

-- 插入社团数据
INSERT INTO club (name, category, leader, leader_contact, advisor, description, status) VALUES
('计算机协会', '学术科技', '张三', '13800138001', '李老师', '计算机协会是一个专注于计算机技术学习和交流的社团', 'normal'),
('文学社', '文化艺术', '李四', '13900139002', '王老师', '文学社致力于文学创作和交流', 'normal'),
('篮球队', '体育健身', '王五', '13700137003', '赵老师', '篮球队专注于篮球技能训练和比赛', 'normal'),
('志愿者协会', '公益志愿', '赵六', '13600136004', '钱老师', '志愿者协会组织各种公益活动', 'normal'),
('摄影社', '文化艺术', '孙七', '13500135005', '周老师', '摄影社专注于摄影技术学习和作品展示', 'pending');

-- 插入成员数据
INSERT INTO member (id, name, gender, major, club, role, contact, status) VALUES
('2023001', '张三', '男', '计算机科学与技术', '计算机协会', 'leader', '13800138001', 'normal'),
('2023002', '李四', '女', '汉语言文学', '文学社', 'leader', '13900139002', 'normal'),
('2023003', '王五', '男', '体育教育', '篮球队', 'leader', '13700137003', 'normal'),
('2023004', '赵六', '女', '社会工作', '志愿者协会', 'leader', '13600136004', 'normal'),
('2023005', '孙七', '男', '视觉传达设计', '摄影社', 'leader', '13500135005', 'normal'),
('2023006', '周八', '男', '计算机科学与技术', '计算机协会', 'core', '13400134006', 'normal'),
('2023007', '吴九', '女', '汉语言文学', '文学社', 'member', '13300133007', 'normal');

-- 插入活动数据
INSERT INTO activity (name, club, leader, start_time, end_time, location, description, budget, status) VALUES
('编程大赛', '计算机协会', '张三', '2026-04-10 14:00:00', '2026-04-10 18:00:00', '教学楼A101', '面向全校学生的编程大赛', 5000, 'approved'),
('文学讲座', '文学社', '李四', '2026-04-12 15:00:00', '2026-04-12 17:00:00', '图书馆报告厅', '邀请知名作家进行文学讲座', 2000, 'pending'),
('篮球友谊赛', '篮球队', '王五', '2026-04-15 16:00:00', '2026-04-15 18:00:00', '体育馆', '与其他高校篮球队的友谊赛', 3000, 'approved'),
('社区服务', '志愿者协会', '赵六', '2026-04-18 09:00:00', '2026-04-18 12:00:00', '阳光社区', '社区清洁和敬老活动', 1000, 'approved'),
('摄影展', '摄影社', '孙七', '2026-04-20 10:00:00', '2026-04-22 17:00:00', '艺术楼展厅', '社团成员摄影作品展览', 4000, 'pending');

-- 插入资料数据
INSERT INTO material (name, club, category, file_path, uploader, description, size) VALUES
('编程大赛规则.pdf', '计算机协会', '文档', '/uploads/materials/1.pdf', '张三', '2026年编程大赛的比赛规则', 1200000),
('文学社招新海报.jpg', '文学社', '图片', '/uploads/materials/2.jpg', '李四', '2026年文学社招新海报', 2500000),
('篮球训练计划.xlsx', '篮球队', '文档', '/uploads/materials/3.xlsx', '王五', '篮球队训练计划', 800000),
('志愿者培训视频.mp4', '志愿者协会', '视频', '/uploads/materials/4.mp4', '赵六', '志愿者培训视频', 50000000),
('摄影技巧手册.pdf', '摄影社', '文档', '/uploads/materials/5.pdf', '孙七', '摄影技巧学习手册', 3500000);