const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const Post = require('./models/post')

//app config
const app = express();

mongoose.connect('mongodb://localhost/restful_music_blog');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Structure of blog
//title of song / album / other
//image of album / artist
//body - review (include start rating)
//created

//RESTful Routes

app.get('/', (req, res) => {
    res.redirect('/posts');
});

//Index route
app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                posts: posts
            });
        }
    });
});

//New route
app.get('/posts/new', (req, res) => {
    res.render('new');
});

//Create route
app.post('/posts', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, (err, newPost) => {
        if(err) {
            res.render('new');
        } else {
            res.redirect('/posts')
        }
    });
});

//Show route
app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        console.log(foundPost)
        if(err) {
            res.redirect('/posts');
        } else {
            res.render('show', {post: foundPost});
        }
    });
});

//Edit route
app.get('/posts/:id/edit', (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if(err) {
            res.redirect('/posts')
        } else {
            res.render('edit', {post: foundPost})
        }
    });
});

//Update route
app.put('/posts/:id', (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
        if(err) {
            res.redirect('/posts');
        } else {
            res.redirect(`/posts/${req.params.id}`);
        }
    });
});

//Destroy route
app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts')
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000.')
});