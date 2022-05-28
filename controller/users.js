const Users = require('../models/users');
const { hasSuccess, hasError  } = require('../responseHandle');

const users = {
    getUserInfo: async (req, res, next) => {
        const data = await Users.find();
        hasSuccess(res, 200, data)
    },
    createAccount: async (req, res, next)=>{
        const data = req.body;
        const filter = {
            email:data.email
        }
        // console.log(req.body);
        const checkEmailOnly = await Users.find(filter);
        // console.log(checkEmailOnly)
        if( checkEmailOnly ){
            const errMsg = '帳號已存在'
            return next(hasError(400, errMsg, next))
        } else {
            const msg = '帳號創建成功'
            const newUser = await Users.create(data);
            hasSuccess(res, 200, { msg, newUser});
        }
    }
}

module.exports = users;
