const mongoose = require('mongoose');

const postSchema = {
    userName: {
        type: String,
        required: [true, '貼文姓名未填寫'],
    },
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
        default: Date.now,
        select: false,
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

}

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
