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
        const data = {
            ...req.body
        }
        const newData = await Posts.create(data);
        const allData = await Posts.find({});
        res.status(200).json({
            status: '新增貼文成功',
            newPost: newData,
            allPost: allData
        });
    },
    deleteMany:  async (req, res, next) => {
        const dbRes = await Posts.deleteMany({});
        res.status(200).json({
            status: '新增貼文成功',
            newPost: newData,
            allPost: allData
        });
    },
    deleteOne: async (req, res, next)=>{
        const _id = req.params.id;
        const deleteData = await Posts.find({_id});
        const deletedCount = (await Posts.deleteOne({_id})).deletedCount;
        // console.log(_id,deleteData,deletedCount);
        if(deletedCount !== 0){
            res.status(200).json({
                status: 'success',
                message: '資料刪除成功!',
                deleteData
            })
        } else {
            res.status(200).json({
                status: false,
                message: '查無此ID',
                id: _id
            })
        }
    },
    update:  async (req, res, next)=>{
        const _id = req.params.id;
        const data = {
            ...req.body
        }
        const updataCount = (await Posts.updateOne({_id}, data)).modifiedCount;
        if( updataCount != 0){
            const allData = await Posts.find({});
            res.status(200).json({
                status: 'success',
                message: '資料修改成功!',
                allData
            });
        } else {
            res.status(200).json({
                status: false,
                message: '資料修改失敗，或無此筆資料!',
            });
        }

    }
}

module.exports = posts;
