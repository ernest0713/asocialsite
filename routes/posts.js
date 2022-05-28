const express = require('express');
const router = express.Router();
const posts = require('../controller/posts');
const { handleErrorAsync } = require('../responseHandle');

router.get('/posts', handleErrorAsync(posts.get));
router.post('/post', handleErrorAsync(posts.post));
router.delete('/posts', handleErrorAsync(posts.deleteMany));
router.delete('/post/:id', handleErrorAsync(posts.deleteOne));
router.patch('/post/:id', handleErrorAsync(posts.update));

module.exports = router;
