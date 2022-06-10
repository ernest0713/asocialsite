const mongoose = require('mongoose');

const userSchemaSetting = {
    email: {
        type: String,
        required: [true, 'email為必填欄位'],
        unique: true,
        lowercase: true,
        select: false,
    },
    userName: {
        type: String,
        required: [true, '暱稱未填寫'],
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
              return new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/, 'g')
            },
            message: () => '密碼格式錯誤'
        },
        required: [true, '尚未設定密碼'],
        select: false,
    },
    avatar: {
        type: String,
        default: 'https://randomuser.me/api/portraits/lego/3.jpg',
    },
    gender: {
        type: String,
        enum: ['female', 'male', 'none'],
        default: 'none',
    },
    follow: {
        type: [
            {
                id: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: [true, '使用者資訊未填寫'],
                },
                datetime_update: { type: Date, default: Date.now },
            }
        ],
        default: [],
    },
    beFollowed: {
        type: [
        {
            id: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, '使用者資訊未填寫'],
            },
            datetime_update: { type: Date, default: Date.now },
        },
        ],
        default: [],
    },
    likeList: {
        type: [String],
        default: [],
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    }
}

const userSchemaOption = {
    versionKey: false
}

const userSchema = new mongoose.Schema(userSchemaSetting, userSchemaOption)

const Users = mongoose.model('Users', userSchema);

module.exports = Users;

