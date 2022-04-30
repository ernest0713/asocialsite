const express = require('express');
const router = express.Router();
const posts = require('../controller/posts');

router.get('/', posts.get);
router.post('/', posts.post);
router.delete('/', posts.deleteMany);
router.delete('/:id', posts.deleteOne);
router.patch('/:id', posts.update);

module.exports = router;
