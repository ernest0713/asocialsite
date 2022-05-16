const mongoose = require('mongoose');

const userSchemaSetting = {
    email: {
        type: String,
        required: [true, '帳戶需填寫']
    },
    password: {
        type: String,
        min: [6, '密碼需大於6個字元'],
        max: [15, '密碼需低於15個字元'],
        required: [true, '密碼需填寫']
    },
    userName: {
        type: String,
        required: [ true , '姓名欄位未填寫' ]
    },
    userPhoto: {
        type: String,
        default: 'https://reurl.cc/Xjmakg',
    },
    createAt: {
        type: Date,
        default: Date.now,
        select: false,
    },

}

const userSchemaOption = {
    versionKey: false
}

const userSchema = new mongoose.Schema(userSchemaSetting, userSchemaOption)

const Users = mongoose.model('Users', userSchema);

module.exports = Users;

