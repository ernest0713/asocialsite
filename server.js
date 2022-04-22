const http = require('http');
const mongoose = require('mongoose');
const Posts = require('./models/posts');
const dotenv = require('dotenv');
// set env path
dotenv.config({path: './config.env'});

// connect Db cloud
const DB = process.env.DB_ADDRESS.replace('<password>', process.env.DB_PASSWORD)
mongoose.connect(DB)
    .then(()=>console.log('DB connect success'))
    .catch(e=>console.log('Connect fail! \n', e ));

// create web server
const serverLisentner = async (req, res)=>{
    const headers = {
        'access-control-allow-headers': 'content-type, authorization, content-length, x-requested-with',
        'access-control-allow-origin': '*',
        'access-control-allow-method': 'patch,post,get,options,delete',
        'content-type': 'application/json'
    };

    let body = '';

    req.on('data', chunk => body += chunk);

    if(req.url == '/posts' && req.method=='GET'){
        Posts.find({})
            .then((data)=> {
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: '取得貼文成功',
                    data: data
                }));
                res.end();
                console.log(`From "${req.connection.remoteAddress}"got post data!`)
            })
            .catch((e)=>{
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    status: '取得貼文失敗',
                    errMessage: '路由無效或方法錯誤'
                }));
                res.end();
            });
    } else if(req.url == '/posts' && req.method =="POST") {
        req.on('end', ()=>{
            try {
                const userName = JSON.parse(body).userName;
                const tags = JSON.parse(body).tags;
                const content = JSON.parse(body).content;
                if( userName !== undefined && content !== undefined){
                    Posts.create({
                        userName,
                        tags,
                        content
                    })
                    .then((data)=>{
                        Posts.find({})
                            .then((allPost)=>{
                                res.writeHead(200, headers);
                                res.write(JSON.stringify({
                                    status: 'success',
                                    newPost: data,
                                    allPost: allPost
                                }));
                                res.end();
                            })
                    })
                    .catch((e)=>{
                        res.writeHead(404, headers);
                        res.write(JSON.stringify({
                            status: false,
                            errMessage: '資料寫入失敗!'
                        }));
                        res.end();
                        console.log(e);
                    })

                } else {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({
                        status: false,
                        message: '資料格式錯誤!'
                    }));
                    res.end();
                }
            } catch(e) {
                // console.log(e);
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    status: false,
                    message: '無此路由或路徑錯誤!'
                }));
                res.end();
            }

        })
    } else if(req.url == '/posts' && req.method =="DELETE"){
        Posts.deleteMany({})
            .then((msg)=>{
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: 'success',
                    message: `成功刪除全部資料，共刪除 ${msg.deletedCount} 筆資料。`
                }));
                res.end();
                // console.log(msg);
            })
            .catch((e)=>{
                console.log(e);
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    status: false,
                    message: `刪除失敗，請確認 API & Methode 是否正確`
                }));
                res.end();
            })
    } else if(req.url.startsWith('/posts/') && req.method =="DELETE") {
        const _id = req.url.split('/').pop();
        const deleteData = await Posts.find({_id});
        Posts.deleteOne({_id})
            .then((msg)=>{
                if(msg.deletedCount !== 0){
                    // console.log(msg);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: 'success',
                        message: '資料刪除成功!',
                        deleteData
                    }));
                    res.end();
                } else {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: false,
                        message: '查無此ID'
                    }));
                    res.end();
                }
            })
            .catch((e)=>{
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    status: false,
                    message: '無此路由或 ID 錯誤!'
                }));
                res.end();
                console.log(e);
            })
    } else if(req.url.startsWith('/posts/') && req.method =="PATCH") {
        req.on('end', ()=>{
            try {
                const _id = req.url.split('/').pop();
                const content = JSON.parse(body).content;
                console.log(_id, content);
                if( _id !== undefined && content !== undefined ){
                    Posts.updateOne({_id}, {content})
                        .then(async (msg)=>{
                            const data = await Posts.find({})
                            res.writeHead(200, headers);
                            res.write(JSON.stringify({
                                status: 'success',
                                data: data
                            }));
                            res.end();
                        })
                        .catch((e)=>{
                            res.writeHead(404, headers);
                            res.write(JSON.stringify({
                                status: false,
                                message: '查無資料，或格式錯誤!'
                            }));
                            res.end();
                            console.log(e);
                        })
                } else {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({
                        stats: false,
                        message: '無此路由，或者資料格式錯誤!'
                    }));
                    res.end();
                }
            } catch (e) {
                console.log(e);
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    stats: false,
                    message: '無此路由，或者資料 ID 錯誤!'
                }));
                res.end();
            }
        })
    } else if(req.url == '/posts' && req.method =="OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: false,
            message: '無此路由，或者API 路徑錯誤!'
        }));
        res.end();
    }

}

const server = http.createServer(serverLisentner);

server.listen(process.env.PORT || 3005);

console.log('Sever created!');
