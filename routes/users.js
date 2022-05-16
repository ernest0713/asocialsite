const express = require('express');
const router = express.Router();
const users = require('../controller/users');

/* GET users listing. */
router.get('/', users.getUserInfo);
router.post('/', users.createAccount);

module.exports = router;
