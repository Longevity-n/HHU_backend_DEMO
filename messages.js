const express = require('express');
const router = express.Router();
const pool = require('../../db'); 
const { auth } = require('../../utils'); //这里的中间件名称都叫auth！！！

// 1.用户提交寄语
// 提交寄语接口：
// 地址：http://localhost:3000/user/messages
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.id; // 从token中获取发送人ID

    await pool.execute(
      'INSERT INTO `message` (sender_id, content, time) VALUES (?, ?, NOW())',
      [senderId, content]
    );

    res.status(201).json({
      success: true,
      message: '寄语提交成功，待审核'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '提交寄语失败：' + err.message
    });
  }
});

// 2.获取所有审核通过的寄语
// 获取审核通过的寄语接口：
// 地址：http://localhost:3000/user/messages/approved
router.get('/approved', auth, async (req, res) => {
  try {
    const [messages] = await pool.execute(
      `SELECT m.*, u.username 
       FROM \`message\` m 
       JOIN \`user\` u ON m.sender_id = u.id 
       WHERE m.is_approved = 1 
       ORDER BY m.time DESC`
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取寄语列表失败：' + err.message
    });
  }
});

module.exports = router;