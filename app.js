const express = require('express');
const cors = require('cors');
const app = express();

//导入路由
const loginRoutes = require('./routes/auth/login');
const registerRoutes = require('./routes/auth/register');
// const adminUserRoutes = require('./routes/admin/users'); // 需在admin目录下创建users.js
// const adminWorkRoutes = require('./routes/admin/works'); // 需在admin目录下创建works.js
// const adminMessageRoutes = require('./routes/admin/messages'); // 需在admin目录下创建messages.js
// const adminCommentRoutes = require('./routes/admin/comments'); // 需在admin目录下创建comments.js
const userMessageRoutes = require('./routes/user/messages'); // 需在根目录创建user目录及messages.js
const userStudentworkRoutes = require('./routes/user/studentwork'); // 需在根目录创建user目录及studentwork.js

// const userCommentRoutes = require('./routes/user/comments'); // 需在根目录创建user目录及comments.js

//中间件
app.use(cors({
  origin: 'http://127.0.0.1:5500', // 允许前端端口访问
  credentials: true
}));

app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true }));

//挂载路由（明确URL映射）
app.use('/login', loginRoutes);                 // 登录接口：http://localhost:3000/login
app.use('/register', registerRoutes);           // 注册接口：http://localhost:3000/register
// app.use('/admin/users', adminUserRoutes);       // 管理员用户：http://localhost:3000/admin/users/...
// app.use('/admin/works', adminWorkRoutes);       // 管理员作品：http://localhost:3000/admin/works/...
// app.use('/admin/messages', adminMessageRoutes); // 管理员寄语：http://localhost:3000/admin/messages/...
// app.use('/admin/comments', adminCommentRoutes); // 管理员评论：http://localhost:3000/admin/comments/...
app.use('/user/messages', userMessageRoutes);   // 学生/教师寄语：http://localhost:3000/user/messages/...
app.use('/user/studentwork', userStudentworkRoutes);   // 学生作品展示：http://localhost:3000/user/studentwork/...
// app.use('/user/comments', userCommentRoutes);   // 学生/教师评论：http://localhost:3000/user/comments/...

// 根路径重定向到前端登录页面
app.get('/', (req, res) => {
  res.redirect('http://127.0.0.1:5500/login.html'); // 跳转到前端登录页
});



module.exports = app;// 导出app供server.js使用