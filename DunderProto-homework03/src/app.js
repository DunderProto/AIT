// app.js
const webby = require('./webby.js');
const path = require('path');
const app = new webby.App();

app.use(webby.static(path.join(__dirname, '..', 'public')));

app.get('/gallery', function(req, res) {
    // send back a response if route matches
    // res.send('<img src="/public/img/animal1.jpg">'); 
    // // res.send("<img src='./img/animal1.jpg' />");
    let s = "<html><title>Homework 3</title><link rel='stylesheet' type='text/css' href='/css/style.css'><body>";
    let random = Math.ceil(Math.random()*4);
    if (random === 1) {
        s += "<h1>Here is 1 gecko!</h1>" 
    } else {
        s += "<h1>Here are " + random + " geckos!</h1>"
    }
    for (let i = 0; i < random; i++) {
        let random2 = Math.ceil(Math.random()*4);
        s += "<img src='/img/animal" + random2 + ".jpg'>"
    }
    s += "</body></html>"
    res.send(s);
});

// app.get('/fff', function(req, res) {
//     res.send('<img src="/img/animal1.jpg" width="500" height="500" >')
// })

app.get('/css/styles.css', function(req, res) {
    res.send('/css/styles.css');
})

app.get('/pics', function(req, res) {
    res.set("Location", "/gallery");
})

app.get('/img/animal1.jpg', function(req, res) {
    res.status(301);
    res.set("Location", '/gallery');
    res.send('/gallery');
})
app.listen(3000, '127.0.0.1');
