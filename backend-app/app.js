const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectionURL = 'mongodb+srv://test-user:lmbtS6lQeASqJxm7@cluster0.7aiko.gcp.mongodb.net/knowledgeSharingApp?retryWrites=true&w=majority';

const postList = require('./routes/post-routes');
const userList = require('./routes/user-routes');
const app = express();
const apiError = require('./models/api-error');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
})

app.use('/api/posts', postList);
app.use('/api/users', userList);

app.use((req, res, next) => {
    return next( apiError( 'Could not find this route. Its invalid route. Please check url and method!', 404 ) ); //return error code 404 for undefined url
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }

    return res.status(error.code || 500).json({message: error.message || ''});    
})

mongoose
    .connect(connectionURL)
    .then(() => {
        console.log('Connection done!!!');
        app.listen(5000); //node server path
    })
    .catch(error => {
        console.log('Error in creattin connection with db', error);
    });
