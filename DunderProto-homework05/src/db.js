// db.js
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Review = new mongoose.Schema({
    rating: Number,
    text: String
});

const Book = new mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    reviews: [Review]
});

Book.plugin(URLSlugs('title author'));
mongoose.model("Book", Book);
mongoose.model('Review', Review);
mongoose.connect('mongodb://localhost/hw05');