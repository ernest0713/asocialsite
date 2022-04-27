const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
require('./models/db_connect');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
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

//     } else if(req.url.startsWith('/posts/') && req.method =="PATCH") {
//         req.on('end', ()=>{
//             try {
//                 const _id = req.url.split('/').pop();
//                 const content = JSON.parse(body).content;
//                 console.log(_id, content);
//                 if( _id !== undefined && content !== undefined ){
//                     Posts.updateOne({_id}, {content})
//                         .then(async (msg)=>{
//                             const data = await Posts.find({})
//                             res.writeHead(200, headers);
//                             res.write(JSON.stringify({
//                                 status: 'success',
//                                 data: data
//                             }));
//                             res.end();
//                         })
//                         .catch((e)=>{
//                             res.writeHead(404, headers);
//                             res.write(JSON.stringify({
//                                 status: false,
//                                 message: '查無資料，或格式錯誤!'
//                             }));
//                             res.end();
//                             console.log(e);
//                         })
//                 } else {
//                     res.writeHead(404, headers);
//                     res.write(JSON.stringify({
//                         stats: false,
//                         message: '無此路由，或者資料格式錯誤!'
//                     }));
//                     res.end();
//                 }
//             } catch (e) {
//                 console.log(e);
//                 res.writeHead(404, headers);
//                 res.write(JSON.stringify({
//                     stats: false,
//                     message: '無此路由，或者資料 ID 錯誤!'
//                 }));
//                 res.end();
//             }
//         })
//     } else if(req.url == '/posts' && req.method =="OPTIONS") {
//         res.writeHead(200, headers);
//         res.end();
//     } else {
//         res.writeHead(404, headers);
//         res.write(JSON.stringify({
//             status: false,
//             message: '無此路由，或者API 路徑錯誤!'
//         }));
//         res.end();
//     }



module.exports = app;
