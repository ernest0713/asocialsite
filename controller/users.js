const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { hasSuccess, hasError  } = require('../responseHandle');
const { generateToken } = require('../service');
let errMsg = '';

const users = {
    getUserInfo: async (req, res, next) => {
        const userId = req.params.id;
        const userInfo = await Users.findById(userId).exec();
        errMsg = '無此使用者資訊';
        if (!userInfo) {
            return next( hasError(401, errMsg, next));
        }
        hasSuccess(res, 200,  userInfo)
    },
    createAccount: async (req, res, next)=>{
        let { email, password, confirmPassword, userName } = req.body;
        // 內容不可為空
        const result = await Users.findOne({email});
        if(result){
            errMsg = 'Email已註冊';
            return next(hasError(400, errMsg, next));
        }
        if (!email || !password || !confirmPassword || !userName) {
            errMsg = '欄位未填寫正確！';
            return next(hasError(400, errMsg, next));
        }
        // 密碼正確
        if (password !== confirmPassword) {
            errMsg = '密碼錯誤！';
          return next(hasError(400, errMsg, next));
        }
        // 密碼 8 碼以上，16 碼以下，英大小寫+數+8碼+ exclued 特殊符號
        let reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/, 'g');
        if (password.match(reg) === null) {
            errMsg = '密碼格式錯誤';
            return next(hasError(400, errMsg, next));
        }
        // 暱稱 2 個字以上
        if (!validator.isLength(userName, { min: 2 })) {
            errMsg = '暱稱字數低於 2 碼';
            return next(hasError(400, errMsg, next));
        }
        // 是否為 Email
        if (!validator.isEmail(email)) {
            errMsg = 'Email 格式錯誤';
            return next(hasError(400, errMsg, next));
        }

        // 加密密碼
        password = await bcrypt.hash(password, 12);
        const newUser = await Users.create({
          email,
          password,
          userName,
        });

        const token = generateToken(newUser);
        const data = {
            token,
            id: newUser.id,
            userName: newUser.name
        }

        hasSuccess(res, 200, data)
    },
    login: async (req, res, next)=>{
        const { email, password } = req.body;
        if (!email || !password) {
            errMsg = '帳號密碼不可為空';
            return next( hasError(400, errMsg, next) );
        }
        const user = await Users.findOne({ email }).select('+password');
        if(!user){
            errMsg = "無此帳號"
            return next( hasError(400, errMsg, next))
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            errMsg = '帳號或密碼錯誤';
            return next( hasError(400, errMsg, next) );
        }
        const token = generateToken(user);
        const data = {
            token,
            id: user.id,
            userName: user.name
        }
        hasSuccess(res, 200, data)

    },
    updatePerfile: async (req, res, next)=>{
        const dataTypes = ['string'];
        const attsType = ['userName', 'avatar', 'gender'];
        const genderTypes = ['female', 'male', 'none'];
        const data = req.body;
        // console.log(data);
        // no data
        if (Object.keys(data).length <= 0) {
            errMsg = '請輸入欲修改資料';
            return next( hasError(400, errMsg, next) );
        }

        for (const key in data) {
            if (!attsType.includes(key)) {
                errMsg = `只允許修改'userName', 'avatar', 'gender'等欄位`
                return next( hasError(400, errMsg, next) );
            }
            // check type
            if (!dataTypes.includes(typeof data[key])) {
                errMsg = `${key} 資料格式錯誤`;
                return next( hasError(400, errMsg, next) );
            }

            // check enum
            if (key === 'gender' && !genderTypes.includes(data[key])) {
                errMsg = `性別資料格式錯誤，需為'female', 'male', 'none'其中之一`
                return next( hasError(400, errMsg, next) );
            }
        }

        const option = {
            new: true,
            runValidators: true
        }
        const newUserInfo = await Users.findByIdAndUpdate({ _id: req.user.id }, data, option);

        hasSuccess(res, 200, newUserInfo);
    },
    updatePassword: async (req, res, next)=>{
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            errMsg = '密碼輸入錯誤';
            return next( hasError(400, errMsg, next) );
        }
        // 密碼 8 碼以上，16 碼以下，英大小寫+數+8碼+ exclued 特殊符號
        let reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/, 'g');
        if (password.match(reg) === null) {
            errMsg = '密碼格式錯誤';
            return next( hasError(400, errMsg, next) );
        }

        // check new password is same as old password
        newPassword = await bcrypt.hash(password, 12);
        const currentUser = await Users.findById(req.user.id).select('+password');
        const equal = await bcrypt.compare(password, currentUser.password);
        // console.log(equal);
        if (equal) {
            errMsg = '請輸入新密碼';
            return next( hasError(400, errMsg, next) );
        }

        const user = await Users.findByIdAndUpdate(req.user.id, {
            password: newPassword,
        });
        const token = generateToken(user);
        const data = {
            token,
            id: user.id,
            userName: user.name
        }
        hasSuccess(res, 200, data)
    }
}

module.exports = users;
