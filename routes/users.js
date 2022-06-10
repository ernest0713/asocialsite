const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const { handleErrorAsync } = require('../responseHandle');
const { isAuth } = require('../middleware');

/* GET users listing. */
router.post('/register', handleErrorAsync(users.createAccount));
router.post('/login', handleErrorAsync(users.login));
router.post('/user/updatePassword', isAuth, handleErrorAsync(users.updatePassword));
router.get('/user/perfile/:id', isAuth, handleErrorAsync(users.getUserInfo));
router.patch('/user/perfile/:id', isAuth, handleErrorAsync(users.updatePerfile));


module.exports = router;
