const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { generateToken, comparePassword } = require('../../utils');

// 登录接口（POST /login）
router.post('/', async (req, res) => {
  try {
    const { usersid, password, role } = req.body;

    // 1. 校验必填字段
    if (!usersid || !password || !role) {
      return res.status(400).json({ message: '学号/工号、密码和角色为必填项' });
    }

    // 2. 校验角色合法性（与数据库 ENUM 完全匹配）
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ 
        message: '角色只能是 student、teacher 或 admin' 
      });
    }

    // 3. 查询用户（匹配 usersid 和 role）
    const [users] = await pool.execute(
      'SELECT * FROM `user` WHERE usersid = ? AND role = ?',
      [usersid, role]
    );

    // 4. 验证用户是否存在
    if (users.length === 0) {
      const msg = role === 'admin' 
        ? '管理员账号不存在（工号错误）' 
        : '师生账号不存在（学号/工号错误）';
      return res.status(401).json({ message: msg });
    }

    // 5. 验证密码
    const user = users[0];
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ message: '密码错误' });
    }

    // 6. 生成 Token 并返回用户信息
    const token = generateToken(user.usersid, user.role);
    const { password: _, ...userInfo } = user;

    res.json({
      token,
      user: userInfo,
      message: `${role === 'admin' ? '管理员' : '师生'}登录成功`
    });
  } catch (err) {
    res.status(500).json({ message: '登录失败：' + err.message });
  }
});

module.exports = router;