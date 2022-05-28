const express = require('express');
const router = express.Router();
const posts = require('../controller/posts');
const { handleErrorAsync } = require('../responseHandle');

router.get('/', handleErrorAsync(posts.get));
router.post('/', handleErrorAsync(posts.post));
router.delete('/', handleErrorAsync(posts.deleteMany));
router.delete('/:id', handleErrorAsync(posts.deleteOne));
router.patch('/:id', handleErrorAsync(posts.update));

module.exports = router;
