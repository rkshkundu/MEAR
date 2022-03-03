const apiError = require('../models/api-error');
const { validationResult } = require('express-validator');
const Post = require('../models/post'); //using capital P in post as this is a constructor
const User = require('../models/user');
const mongoose = require('mongoose');
const post = require('../models/post');

const getPostList = async (req, res, next) => {
    try {
        posts = await Post.find().exec();
    } catch(error) {
        return next( apiError( `Error in getting posts! ${error}`, 500 ) );
    }
    
    res.status(200).json(posts); // getters true return object having id inside this
}

const getPostById = async (req, res, next) => {
    const postId = req.params.pid;
    let post;
    try {
        post = await Post.findById(postId).exec();
    } catch(error) {
        return next( apiError( `Error in getting post! ${error}`, 500 ) );
    }
    
    
    if(!post) {
        return next( apiError( 'No post exists for this id!', 404 ) ); //return error code 404 with a message if no post found matching to id
    }

    res.status(200).json(post.toObject({ getters: true })); // getters true return object having id inside this
}

const getPostByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userWithPosts;
    try {
        userWithPosts = await User.findById(userId).populate('posts');
    } catch(error) {
        return next( apiError( `Error in getting post! ${error}`, 500 ) );
    }
    
    
    if(!userWithPosts || userWithPosts.posts.length === 0) {
        return next( apiError( 'No post exists for this user id!', 404 ) ); //return error code 404 with a message if no post found matching to id
    }

    res.status(200).json( userWithPosts.posts.map(post => post.toObject({getters: true})) ); // getters true return object having id inside this
}

const createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
       return next( apiError('Invalid/Empty field!', 422) ); //return error of empty field
    }

    const {description, link, createdBy} = req.body;
    
    let user;

    try {
        user = await User.findById(createdBy);
    }catch (error) {
        return next( apiError(`Error in saving new post ${error}`, 500) );
    }
    
    if(!user) {
        return next( apiError(`Could not find the user for provided id ${createdBy}`, 404) );
    }

    const post =  new Post({
        description, 
        link,
        creator: {
            user: user.name,
            email: user.email
        },
        createdAt: new Date().getTime(),
        createdBy 
    });

    try{
        const session = await mongoose.startSession();

        session.startTransaction();
        await post.save({session});
        user.posts.push(post);
        await user.save({session});
        await session.commitTransaction();
    } catch(error) {
        return next( apiError(`Error in saving new post ${error}`, 500) ); //return error of empty field
    }
    

    res.status(201).json({id: post.id}); // status code 201 when ever we add some new data
}

const updatePost = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
       return next( apiError('Invalid/Empty field!', 422) ); //return error of empty field
    }
    
    const postId = req.params.pid;
    const {description, link} = req.body;
    
    let post;
    try {
        post = await Post.findById(postId);
    } catch(error) {
        return next( apiError( `Error in updating post! ${error}`, 500 ) );
    }
    
    post.description = description;
    post.link = link;

    try {
        await post.save();
    } catch (error) {
        return next( apiError(`Error in updating post! ${error}`, 500));
    }

    res.status(200).json({message: 'Post updated succesfully!', postid: post.id});
}

const deletePost = async (req, res, next) => {
    const postId = req.params.pid;
    
    let post;
    try {
        post = await Post.findById(postId).populate('createdBy');
    } catch(error) {
        return next( apiError( `Error in deleting post! ${error}`, 500 ) );
    }
    
    if(!post) {
        return next( apiError(`Could not find post for this id!!!`, 404) );
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await post.remove({session});
        post.createdBy.posts.pull(post); //post.createdBy refers to user object
        await post.createdBy.save({session});
        await session.commitTransaction();
    } catch (error) {
        return next( apiError(`Error in deleting post! ${error}`, 500));
    }

    res.status(200).json({message: 'Post deleted succesfully!', postid: post.id});
}

exports.getPostList = getPostList;
exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
