const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
require('./models/db_connect');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

//golbal setting
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((req,res,next)=>{
    res.status(404).send('無此頁面，請確認網址是否填寫正確！');
})
app.use((err,req,res,next)=>{
    res.status(500).send('程式發生錯誤，請聯絡系統管理員！');
    consoel.log(err.stack);
})


module.exports = app;
