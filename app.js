const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// 資料庫連線
require('./connections/db_connect');

// 載入路由設定
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const { processError, unhandledRejection, error404, errorResponder } = require('./exception');

// 捕捉程式未知錯誤
process.on('uncaughtException', processError);

// 套件註冊
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由設定
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// 無設定路由迴船 404
app.use(error404);

// 全域錯誤捕捉
app.use(errorResponder);

// 捕捉未監控到的錯誤 - 全域
process.on('unhandledRejection', unhandledRejection);

module.exports = app;
