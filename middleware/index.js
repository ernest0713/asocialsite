const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { handleErrorAsync, hasError } = require('../responseHandle');
const path = require('path');
const multer = require('multer');

const isAuth = handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    let errMsg;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        errMsg = '你尚未登入！';
        return next( hasError(401, errMsg, next) );
    }

    // 驗證 token 正確性
    // 獲得 payload 的資訊，取得 user id
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            errMsg = 'Token 驗證失敗'
            return next( hasError(400, errMsg, next))
        } else {
            resolve(payload);
        }
      });
    });
    // ! check or not check is currentUser exist
    const currentUser = await Users.findById(decoded.id);

    // req 加上 user 資訊，傳回路由
    req.user = currentUser;
    next();
  });

const imageUpload =  multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  },
}).any();

module.exports = {
    isAuth, imageUpload
};
