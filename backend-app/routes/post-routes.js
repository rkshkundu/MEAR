const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postController = require('../controllers/post-controller');
const tokenAuth = require('../middleware/toekn-auth');


router.get('/', postController.getPostList);

router.get('/:pid', postController.getPostById);

router.get('/user/:uid', postController.getPostByUserId);

router.use(tokenAuth); //all routes next to this, post, patch and delete will be validated for token auth

router.post(
	'/add',
	[check('description').not().isEmpty(), check('link').not().isEmpty()], //validation for coming input
	postController.createPost
);

router.put(
	'/:pid',
	[check('description').not().isEmpty(), check('link').not().isEmpty()],
	postController.updatePost
);

router.delete('/:pid', postController.deletePost);

module.exports = router;
