const http = require('http');
const { v4: uuidv4} = require('uuid');

let todos = [];

const serverLisentner = (req, res)=>{
    const headers = {
        'access-control-allow-headers': 'content-type, authorization, content-length, x-requested-with',
        'access-control-allow-origin': '*',
        'access-control-allow-method': 'patch,post,get,options,delete',
        'content-type': 'application/json'
    };
    let body = '';
    req.on('data', chunk => body += chunk);
    if(req.url == '/todos' && req.method=='GET'){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'success',
            data: todos
        }));
        res.end();
    } else if(req.url == '/todos' && req.method =="POST") {
        req.on('end', ()=>{
            try {
                const title = JSON.parse(body).title;
                if( title !== undefined ){
                    todos.push({
                        id: uuidv4(),
                        title
                    });
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: 'success',
                        data: todos
                    }));
                    res.end();
                } else {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({
                        stats: false,
                        message: '資料格式錯誤!'
                    }));
                    res.end();
                }
            } catch(e) {
                console.log(e);
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    stats: false,
                    message: '無此路由，或者API 路徑錯誤!'
                }));
                res.end();
            }
        })
    } else if(req.url == '/todos' && req.method =="DELETE") {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'success',
            data: todos,
            message: '資料已全部刪除!'
        }));
        res.end();
    } else if(req.url.startsWith('/todos/') && req.method =="DELETE") {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(data => data.id == id);
        const delTitle = todos[index].title;
        if( index !== -1){
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                status: 'success',
                data: todos,
                message: `已刪除 ${delTitle}`
            }));
            res.end();
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({
                stats: false,
                message: '無此路由，或者資料格式錯誤!'
            }));
            res.end();
        }
    } else if(req.url.startsWith('/todos/') && req.method =="PATCH") {
        req.on('end', ()=>{
            try {
                const id = req.url.split('/').pop();
                const index = todos.findIndex(data => data.id == id);
                const title = JSON.parse(body).title;
                const preTitle = todos[index].title;
                if( title !== undefined && index !== -1){
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: 'success',
                        data: todos,
                        message: `已將 ${ preTitle } 更正為 ${ title }`
                    }));
                    res.end();
                } else {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({
                        stats: false,
                        message: '無此路由，或者資料格式錯誤!'
                    }));
                    res.end();
                }
            } catch (e) {
                // console.log(e);
                res.writeHead(404, headers);
                res.write(JSON.stringify({
                    stats: false,
                    message: '無此路由，或者資料 ID 錯誤!'
                }));
                res.end();
            }
        })
    } else if(req.url == '/todos' && req.method =="OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            stats: false,
            message: '無此路由，或者API 路徑錯誤!'
        }));
        res.end();
    }

}


const server = http.createServer(serverLisentner);

server.listen(process.env.port || 3005);

console.log('Sever created!');
