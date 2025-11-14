const express = require('express');
const router = express.Router();
const pool = require('../../db'); // 数据库连接（确保路径正确）
const { hashPassword } = require('../../utils'); // 导入密码加密工具

// 注册接口（POST /register）
// 要求：填写学号（usersid）、用户名（username）、密码（password），角色（role）默认为学生或教师
router.post('/', async (req, res) => {
  try {
    const { 
      usersid,   // 学号/工号（对应表中的 usersid 字段）
      username,  // 用户名
      password,  // 密码
      role       // 角色（student/teacher，管理员不允许注册）
    } = req.body;

    // 1.校验必填字段（学号、用户名、密码、角色）
    if (!usersid || !username || !password || !role) {
      return res.status(400).json({ message: '学号、用户名、密码、角色为必填项' });
    }

    // 2.校验角色（只能是学生或教师）
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: '角色只能是 student（学生）或 teacher（教师）' });
    }

    // 3.同一学号不能重复注册
    const [sidExists] = await pool.execute(
      'SELECT * FROM `user` WHERE usersid = ?',
      [usersid]
    );
    if (sidExists.length > 0) {
      return res.status(400).json({ message: '该学号/工号已注册' });
    }

    // 5.加密密码并插入数据库
    const hashedPwd = hashPassword(password);
    const [result] = await pool.execute(
    
      'INSERT INTO `user` (usersid, username, password, role) VALUES (?, ?, ?, ?)',
      [usersid, username, hashedPwd, role] 
    );

    // 6.返回注册成功信息（包含自增id和用户信息）
    res.status(201).json({
      id: result.insertId,       // 表中自增的id
      usersid: usersid,          // 学号/工号
      username: username,
      role: role,
      message: '注册成功'
    });
  } catch (err) {
    console.error('注册失败详细错误：', err); // 打印完整错误，方便排查
    res.status(500).json({ message: '注册失败：' + err.message });
  }
});

module.exports = router;