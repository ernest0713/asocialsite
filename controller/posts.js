const Posts = require('../models/posts');
const Res = require('../responseHandle');

const posts = {
    get: async (req, res, next)=>{
        const data = await Posts.find({});
        Res.success(res,200,'取得貼文成功',data);
    },
    post: async (req, res, next) => {
        try {
            const data = req.body;
            const newData = await Posts.create(data);
            const allData = await Posts.find().populate({
                path: 'users',
                select: 'userName userPhoto'
            });
            const msg = '新增貼文成功';
            Res.success(res,200,msg,{newData, allData});
        } catch (e){
            Res.error(res, 400, e.message);
            // console.log(e)
        }
    },
    deleteMany:  async (req, res, next) => {
        try {
            if(req.originalUrl.startsWith("/posts/")){
                const msg = 'API錯誤，或未填寫ID，未刪除任何資料。';
                Res.error(res, 404, msg)
            }else {
                const delCount = (await Posts.deleteMany({})).deletedCount;
                const msg = `全部貼文已刪除，共刪除 ${delCount} 筆資料`
                Res.success(res, 200, msg)
            }
        } catch (e){
            Res.error(res, 400, e.message);
        }
    },
    deleteOne: async (req, res, next)=>{
        try{
            const deleteData = await Posts.findByIdAndDelete(req.params.id);
            // console.log(_id,deleteData,deletedCount);
            if(deleteData !== null){
                const msg = '資料刪除成功!'
                Res.success(res, 200, msg,deleteData);
            } else {
                const msg =  '查無此筆資料！';
                Res.error(res, 404, msg);
            }
        }catch(e){
            Res.error(res, 404, e.message);
            // console.log(e);
        }
    },
    update:  async (req, res, next)=>{
        try {
            const option = {
                new: true,
                runValidators: true
            }
            const data = req.body;
            if(data.content.trim().length === 0 ) {
                const msg = 'content不可為空';
                Res.error(res, 400, msg)
            } else {
                const result = await Posts.findByIdAndUpdate(req.params.id, data, option);
                if( result != null){
                    const msg = '資料修改成功!';
                    Res.success(res, 200, msg, result)
                } else {
                    const msg = '資料修改失敗，或無此筆資料!';
                    es.error(res, 404, msg)
                }
            }
        } catch (e) {
            Res.error(res, 400, e.message);
            // console.log(e);
        }

    }
}

module.exports = posts;
