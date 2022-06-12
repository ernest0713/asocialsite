var express = require('express');
var router = express.Router();
const filesUpload = require('../controller/filesUpload');
const { isAuth, imageUpload } = require('../middleware');
const { handleErrorAsync } = require('../responseHandle');

router.post('/upload/image', isAuth, imageUpload,
  handleErrorAsync(async (req, res, next) => {
    /*
        #swagger.tags = ['Files - 圖片上傳']
        #swagger.description = '上傳圖片取得圖片網址 API'
    */
    filesUpload.images(req, res, next);
  })
);

module.exports = router;
