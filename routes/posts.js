const express = require('express');
const router = express.Router();
const posts = require('../controller/posts');
const { handleErrorAsync } = require('../responseHandle');
const { isAuth } = require('../middleware');

router.get('/posts', isAuth, handleErrorAsync(posts.get));
router.post('/post', isAuth, handleErrorAsync(posts.post));
router.delete('/posts', isAuth, handleErrorAsync(posts.deleteMany));
router.delete('/post/:id', isAuth, handleErrorAsync(posts.deleteOne));
router.patch('/post/:id', isAuth, handleErrorAsync(posts.update));

module.exports = router;
