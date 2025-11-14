// 创建 Express 应用
const app = require('./app');

// 定义端口号
const port = 3000;

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`服务器已启动，访问地址：http://localhost:${port}`);
});
