const Posts = require('../models/posts');

const posts = {
    get: async (req, res, next)=>{
        const data = await Posts.find({});
        res.status(200).json({
            status: '取得貼文成功',
            data: data
        });

    },
    post: async (req, res, next) => {
        try {
            const data = {
                ...req.body
            }
            const newData = await Posts.create(data);
            const allData = await Posts.find({});
            res.status(200).json({
                status: true,
                message: "新增貼文成功",
                newData: newData,
                allData: allData
            });
        } catch (e){
            res.status(200).json({
                status: false,
                message: e.message
            });
            console.log(e);
        }
    },
    deleteMany:  async (req, res, next) => {
        try {
            if(req.originalUrl.startsWith("/posts/")){
                res.status(200).json({
                    status: false,
                    message: 'API錯誤，或未填寫ID，未刪除任何資料。'
                });
            }else {
                const delCount = (await Posts.deleteMany({})).deletedCount;
                res.status(200).json({
                    status: true,
                    message: `全部貼文已刪除，共刪除 ${delCount} 筆資料`
                });
            }
        } catch (e){
            console.log(e);
        }
    },
    deleteOne: async (req, res, next)=>{
        try{
            const deleteData = await Posts.findByIdAndDelete(req.params.id);
            // console.log(_id,deleteData,deletedCount);
            if(deleteData !== null){
                res.status(200).json({
                    status: true,
                    message: '資料刪除成功!',
                    deleteData
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: '查無此筆資料！'
                })
            }
        }catch(e){
            res.status(200).json({
                status: false,
                message: '查無此筆資料！'
            })
            console.log(e);
        }
    },
    update:  async (req, res, next)=>{
        try {
            const option = {
                new: true
            }
            const data = req.body;
            if(data.content.trim().length === 0 ) {
                res.status(200).json({
                    status: false,
                    message: 'content不可為空'
                });
            } else {
                const result = await Posts.findByIdAndUpdate(req.params.id, data, option);
                if( result != null){
                    res.status(200).json({
                        status: true,
                        message: '資料修改成功!',
                        result
                    });
                } else {
                    res.status(200).json({
                        status: false,
                        message: '資料修改失敗，或無此筆資料!',
                    });
                }
            }
        } catch (e) {
            res.status(200).json({
                status: false,
                message: e.message
            });
            console.log(e);
        }

    }
}

module.exports = posts;
