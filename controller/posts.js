const Posts = require('../models/posts');
const { hasSuccess, hasError  } = require('../responseHandle');
let errMsg = '';
const posts = {
    get: async (req, res, next)=>{
        const { sort, keyword } = req.query;
        let filter = keyword ? { content: new RegExp(`${keyword}`)} : {};
        let sortby = sort === 'asc' ? { createAt: 1 } : { createAt: -1 };
        console.log(filter, sortby)
        const data = await Posts.find(filter).sort(sortby).populate({
            path: 'user', // 設定 schema 的欄位名稱
            select: 'userName userPhoto' // 要顯示的欄位資訊
        })
        // console.log(data);
        hasSuccess(res, 200, data);
    },
    post: async (req, res, next) => {
        const data = {
            user: req.user.id,
            type: req.body.type?.trim(),
            content: req.body.content?.trim(),
            tags: req.body.tags?.trim()
        };
        if(!data.content || !data.type || !data.tags){
            // console.log(data.user, data.content)
            errMsg = `缺少資料欄位，內容須包含'content', 'type', 'tags'，且內容不得為空`;
            return next( hasError(400, errMsg, next) )
        }
        if( !(data.type !== 'person' || data.type !== 'group') ){
            errMsg = `type 欄位值需為'person' or 'group'`;
            return next( hasError(400, errMsg, next) )
        }
        const newData = await Posts.create(data);
        const allData = await Posts.find().populate({
            path: 'user',
            select: 'userName userPhoto'
        });
        hasSuccess(res, 200, { newData, allData });
    },
    deleteMany:  async (req, res, next) => {
        if(req.originalUrl.startsWith("/posts/")){
            const errMsg = 'API錯誤，或未填寫ID，未刪除任何資料。';
            return next( hasError(404, errMsg, next) )
        }
        const result = await Posts.deleteMany({});
        // console.log(typeof(result.deletedCount))
        let msg = '';
        if( !result.deletedCount ) {
            msg = `資料庫已無貼文`;
        } else {
            msg = `共刪除 ${ result.deletedCount }筆資料`;
        }
        hasSuccess(res, 200, { msg })
    },
    deleteOne: async (req, res, next)=>{
            const result = await Posts.findByIdAndDelete(req.params.id);
            if(result == null){
                const errMsg =  '查無此筆資料！';
                return next( hasError(404, errMsg, next) )
            }
            hasSuccess(res, 200, result);
    },
    update: async (req, res, next)=>{
        const dataTypes = ['string'];
        const attsTypes = ['content', 'image', 'tags', 'type'];
        const types = ['person', 'group'];
        const option = {
            new: true,
            runValidators: true
        }
        const data = req.body;
        for(const key in data){
            if(!dataTypes.includes(typeof data[key])){
                errMsg = '資料格式錯誤`,需為 String';
                return next( hasError(400, errMsg, next) )
            }
            if(key === 'content' && !data[key].trim() ) {
                errMsg = 'content不可為空';
                return next( hasError(400, errMsg, next) )
            }
            if( !attsTypes.includes( key ) ) {
                errMsg = `資料欄位錯誤，允許修改'content', 'image', 'tags', 'type'等欄位`;
                return next( hasError(400, errMsg, next) )
            }
            if(!key === 'type' && types.includes(key)){
                errMsg = `type 欄位資訊錯誤，僅能 'person' or 'group' 之一`;
                return next( hasError(400, errMsg, next) )
            }
        }
        const result = await Posts.findByIdAndUpdate(req.params.id, data, option);
        // const result = { tags, type, image, content };
        console.log(result);
        if( result !== null){
            hasSuccess(res, 200, result)
        } else {
            errMsg = '資料修改失敗，或無此筆資料!';
            return next( hasError(400, errMsg, next) )
        }
    }

}

module.exports = posts;
