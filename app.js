const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

//app config
const app = express();

mongoose.connect('mongodb://localhost/restful_music_blog')

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose model config
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

const Post = mongoose.model("Post", postSchema);

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
            })
        }
    })
});

//New route
app.get('/posts/new', (req, res) => {
    res.render('new');
});

//Create route
app.post('/posts', (req, res) => {
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
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000.')
})