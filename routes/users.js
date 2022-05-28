const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const { handleErrorAsync } = require('../responseHandle');

/* GET users listing. */
router.post('/', handleErrorAsync(users.createAccount));
router.post('/perfile', handleErrorAsync(users.getUserInfo));

module.exports = router;
