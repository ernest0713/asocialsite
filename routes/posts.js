const express = require('express');
const router = express.Router();
// const Posts = require('../models/posts');
const posts = require('../controller/posts');
/* GET users listing. */

router.get('/', posts.get);
router.post('/', posts.post);
router.delete('/', posts.deleteMany);
router.delete('/:id', posts.deleteOne);
router.patch('/:id', posts.update);

module.exports = router;
