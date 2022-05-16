const Users = require('../models/users');
const Res = require('../responseHandle')

const users = {
    getUserInfo: async (req, res, next) => {
        try{
            const data = await Users.find();
        }catch(e){
            console.log(e);
        }
    },
    createAccount: async (req, res, next)=>{
        try {
            const data = req.body;
            const msg = '帳號創建成功'
            const filter = {
                email:data.email
            }
            // console.log(req.body);
            const checkEmailOnly = await Users.find(filter);
            console.log(checkEmailOnly)
            if( checkEmailOnly ){
                // console.log(checkEmailOnly);
                Res.error(res,400,'帳號已存在')
            } else {
                const newUser = await Users.create(data);
                Res.success(res,200,msg,newUser);
            }
        } catch(e) {
            const msg = '帳號格式不正確';
            console.log(e.message);
            Res.error(res,400,msg);
        }
    }
}

module.exports = users;
