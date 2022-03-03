const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user-controller');


router.get('/', userController.getUsers);

router.post('/login', 
    [check('email').normalizeEmail().isEmail(), check('password').not().isEmpty()],
    userController.login
);

router.post('/signup', 
    [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').not().isEmpty()], //validation for coming input
    userController.signup
);


module.exports = router;