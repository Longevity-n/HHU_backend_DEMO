const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 生成JWT令牌（登录后返回给客户端）
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, '你的密钥（生产环境用环境变量）', {
    expiresIn: '24h'
  });
};

// 验证令牌中间件（用于保护需要登录的接口）
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 从请求头获取token
  if (!token) return res.status(401).send('未登录');

  try {
    const decoded = jwt.verify(token, '你的密钥');
    req.user = decoded; // 将用户信息（id/role）挂载到req
    next();
  } catch (err) {
    res.status(401).send('令牌无效');
  }
};

// 管理员权限验证中间件
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('无管理员权限');
  }
  next();
};

// 密码加密
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // 10为加密强度
};

// 密码验证（登录时用）
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { generateToken, auth, isAdmin, hashPassword, comparePassword };