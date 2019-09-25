require('./db.js');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const Book = mongoose.model('Book');
const Review = mongoose.model('Review');
const sanitize = require('mongo-sanitize');
const app = express();

// your code goes here!
// how do routes work?
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

// app.use(function(req, res, next){
//     res.locals.user = req.user;
//     res.locals.authenticated = ! req.user.anonymous;
//     next();
// });

app.get('/', function(req, res){
    res.redirect('/books');
});

app.get('/books', function(req, res){
    Book.find({}, function(err, books){
        if(err) {
            console.log(err);
        } else if (sanitize(req.query.author) === "" || sanitize(req.query.author) === undefined) {
            res.render('books', {books: books});
        } else {
            res.render('books', {books: books.filter(book => book.author === sanitize(req.query.author))})
        }
    })
});

app.get('/books-new', function(req, res){
    res.render('bookNew', {});
});

app.post('/books-new', function(req, res){
    new Book({
        title: sanitize(req.body.title),
        author: sanitize(req.body.author),
        isbn: sanitize(req.body.isbn)
    }).save(function(err, books){
        if (err) {
            res.render('bookNew');
        } else {
            res.redirect('/books');
        }
        
    })
});

app.get('/books/:slug', function(req, res){
    Book.findOne({slug: sanitize(req.params.slug)}, function(err, book){
        if(err) {
            console.log("err");
        } else {
            res.render('bookInfo', {book : book});
        }
    });
});

app.post('/books/:slug/comments', function(req, res){
    Book.findOneAndUpdate({slug: sanitize(req.params.slug)}, {$push: {reviews: {rating: sanitize(req.body.rating), text: sanitize(req.body.text)}}}, function(err, book){
        if(err) {
            console.log(err);
        } else {
            // is books/slug/comments supposed to be another template?
            res.redirect('/books/'+sanitize(req.params.slug));
        }
    })
});

app.listen(3000);
