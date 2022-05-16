const mongoose = require('mongoose');
const postSchemaSetting = {
    tags: [
        {
            type: String,
            default: '',
            // required: [true, '貼文標籤 tags 未填寫'],
        },
    ],
    type: {
        type: String,
        default: '',
        // enum: ['group', 'person'],
        // required: [true, '貼文類型 type 未填寫'],
    },
    image: {
        type: String,
        default: '',
    },
    createAt: {
        type: Date,
        default: Date.now
        // select: false, // 不回傳此欄位
    },
    content: {
        type: String,
        required: [true, 'Content 未填寫'],
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, '貼文 ID 未填寫']
    }

}
const postSchemaOption = {
    versionKey: false
}


const postSchema = new mongoose.Schema(postSchemaSetting, postSchemaOption)

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
