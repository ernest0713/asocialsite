const express = require('express');
const router = express.Router();
const users = require('../controller/users');

/* GET users listing. */
router.post('/', users.createAccount);
router.post('/perfile', users.getUserInfo);

module.exports = router;
