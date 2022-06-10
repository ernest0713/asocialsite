const mongoose = require('mongoose');
const postSchemaSetting = {
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, '使用者資訊未填寫'],
    },
    tags: [
    {
        type: String,
        required: [true, '貼文標籤 tags 未填寫'],
    },
    ],
    type: {
        type: String,
        enum: ['group', 'person'],
        required: [true, '貼文類型 type 未填寫'],
    },
    image: {
        type: String,
        default: '',
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: [true, 'Content 未填寫'],
    },
    likes: {
        type: [String],
        default: [],
    }
}

const postSchemaOption = {
    versionKey: false
}


const postSchema = new mongoose.Schema(postSchemaSetting, postSchemaOption)

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
