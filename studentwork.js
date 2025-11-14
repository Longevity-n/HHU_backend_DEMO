const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { auth } = require('../../utils'); 

// 获取轮播作品列表
router.get('/carousel', auth, async (req, res) => {
   try {
    //查询所有作品（如果只轮播图片，就加上注释行）
    const [works] = await pool.execute(
      `SELECT 
        id, 
        title,
        content, 
        image, 
        upload_time 
       FROM student_work 
      //  WHERE image IS NOT NULL 
       ORDER BY upload_time DESC  //按上传时间排序`
    );

    res.json({
      success: true,
      data: works
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取轮播作品失败：' + err.message
    });
  }
});

// 1.获取学子作品列表
router.get('/list', auth, async (req, res) => {
  try {
    //查询所有作品，并关联作者用户名
    const [works] = await pool.execute(
      `SELECT sw.*, u.username 
       FROM student_work sw 
       JOIN \`user\` u ON sw.student_id = u.id 
       ORDER BY sw.upload_time DESC` 
    );

    res.json({
      success: true,
      data: works, //数组
      total: works.length // 附带作品总数
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取作品列表失败：' + err.message
    });
  }
});


// 2.作品详情
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [work] = await pool.execute(
      `SELECT sw.*, u.username 
       FROM student_work sw 
       JOIN \`user\` u ON sw.student_id = u.id 
       WHERE sw.id = ?`,
      [id]
    );

    if (work.length === 0) {
      return res.status(404).json({
        success: false,
        message: '作品不存在'
      });
    }

    res.json({
      success: true,
      data: work[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取作品详情失败：' + err.message
    });
  }
});

module.exports = router;
