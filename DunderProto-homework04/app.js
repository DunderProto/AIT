// app.js
// ======
// bring in dependencies like path, fs, etc.
// express setup goes here

// bring in vfs/FileSystem.js b
// let declare a global variable containing the instance of the class
// contained in FileSystem.js


// read init.json with path.join(__dirname, 'vfs', 'init.json')
// in callback:
// 1. parse json with JSON.parse
// 2. instantiate FileSystem object with object created from parsing init.json
// 3. listen on port 3000
const express = require('express');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const files = require('./vfs/FileSystem.js');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

let fileSystem;
let obj;
fs.readFile('vfs/init.json', function(err, data){
    if (err) {
        throw err;
    }
    obj = JSON.parse(data);
    fileSystem = new files.FileSystem(obj);
});

app.get('/', function(req, res){
    fileSystem.makeDirectory('/bin', 'hello');
    res.render('index');
});

app.get('/vfs', function(req, res){
    if (req.query.os === "debian") {
        res.render('terminalDebian');
    } else if (req.query.os === "redhat") {
        res.render('terminalRedhat');
    } else if (req.query.os === "ubuntu") {
        res.render('terminalUbuntu');
    }
});

app.post('/vfs', function(req, res, next) {
    res.redirect('/vfs');
})

app.listen(3000);
console.log('Started server on port 3000');