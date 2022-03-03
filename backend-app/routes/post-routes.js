const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postController = require('../controllers/post-controller');


router.get('/', postController.getPostList);

router.get('/:pid', postController.getPostById);

router.get('/user/:uid', postController.getPostByUserId);

router.use();

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
