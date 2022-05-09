const apiError = require('../models/api-error');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); //to covert password string into s hash encoded string
const jwt = require('jsonwebtoken'); //to create a token once user logged in

const getUsers = async (req, res, next) => {
	let users;

	try {
		users = await User.find({}, '-password'); //dont want to get passowrd, excluding password
	} catch (error) {
		return next(apiError(`Error in getting users list!!! ${error}`, 500));
	}

	res.status(200).json(users);
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(apiError('Invalid/Empty field!', 422)); //return error of empty field
	}

	const { name, email, password } = req.body;

	let hasUser;

	try {
		hasUser = await User.findOne({ email: email });
	} catch (error) {
		return next(
			apiError(`User with this email id already exists! ${error}`, 500)
		);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		return next(apiError(`Can not create user! ${error}`, 500));
	}

	const createdUser = new User({
		name,
		email,
		password: hashedPassword,
		posts: [],
	});

	try {
		await createdUser.save();
	} catch (error) {
		return next(apiError(`Error in user signup! ${error}`, 500));
	}

	let token;
	try {
		token = jwt.sign(
			{ userdId: createdUser.id, email: createdUser.email },
			process.env.TOKEN_SECRET_KEY,
			{ expiresIn: '2h' }
		);
	} catch (error) {
		return next(
			apiError(`Error in creating token for signed up user! ${error}`, 500)
		);
	}

	res.status(201).json({
		message: 'User created successfully!',
		id: createdUser.id,
		email: createdUser.email,
		name: createdUser.name,
		token,
	});
};

const login = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(apiError('Invalid/Empty field!', 422)); //return error of empty field
	}

	const { email, password } = req.body;
	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (error) {
		return next(
			apiError(`Logging in failed, no such email exists! ${error}`, 500)
		);
	}

	if (!existingUser) {
		return next(apiError('Invalid email!!!', 401));
	}

	let isPasswordValid = false;
	try {
		isPasswordValid = await bcrypt.compare(password, existingUser.password);
	} catch (error) {
		return next(apiError('Please check your credenatils!!!', 500));
	}

	if (!isPasswordValid) {
		return next(apiError('Invalid password!!!', 401));
	}

	let token;
	try {
		token = jwt.sign(
			{ userdId: existingUser.id, email: existingUser.email },
			process.env.TOKEN_SECRET_KEY,
			{ expiresIn: '2h' }
		);
	} catch (error) {
		return next(
			apiError(`Error in creating token for logged in user! ${error}`, 500)
		);
	}

	res
		.status(200)
		.json({
			id: existingUser.id,
			email: existingUser.email,
			name: existingUser.name,
			token,
		});
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
