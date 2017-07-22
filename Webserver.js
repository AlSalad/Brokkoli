const express = require('express')
const app = express()
var fs = require("fs");
var path = require("path");
var Blog = require('./blog.json'); //with path
var User = require('./user.json'); //with path
var jwt = require('jsonwebtoken');


app.listen(3000, function () {
  console.log('Webserver listening on port 3000!')
 // console.log(blog);
 // console.log(user);
  
})

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Get Routen
//##################################################################

//GET kompletten Blog
app.get('/api/V1/blog', function (req, res) {
    //Wenn nicht eingeloggt, zeige nur Blogeinträge die nicht hidden sind
    if (res.locals.authenticated) {
        res.json(Blog);
    } else {
        res.json(Blog.filter((element) => {
        return !element.hidden;
        }));
    }
    
})

//GET spezifischen Blogeintrag
app.get('/api/V1/blog/:id', function (req, res) {

    //Wenn nicht eingeloggt
    if (Blog[req.params.id].hidden && !res.locals.authenticated) {
        res.status(401).send('You are not authorized');
        return;
    }

    res.json(Blog[req.params.id]);
})

// PUT Routen
//##################################################################

//Login
app.put('/api/V1/login', function (req, res) { 
  if (req.body.username != user.username || req.body.password != user.password) {
    res.status(403).json({
      message: 'Username or password is incorrect'
    });
    return;
  }

    res.status(400).send('Success');

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 120), 
        username: User.username
     }, 'asdf');


    res.status(200).json({
        token: token
    });
})


app.put('/api/V1/passwordRecovery', function (req, res) {
    console.log('PUT: /api/V1/passwordRecovery !')
     
})

//Edit Blog entry
app.put('/api/V1/blog/:id', function (req, res) {
    if (!Blog[req.params.id]) {
        res.status(404).send('ID not exsiting');
        return;
    }

    //   if (!res.locals.authenticated && blog[req.params.id].hidden) {
    //     res.status(401).send();
    //     return;
    //   }

    Blog[req.params.id].title   = req.body.title    || Blog[req.params.id].title;
    Blog[req.params.id].picture = req.body.picture  || Blog[req.params.id].picture;
    Blog[req.params.id].author  = req.body.author   || Blog[req.params.id].author;
    Blog[req.params.id].about   = req.body.about    || Blog[req.params.id].about;
    Blog[req.params.id].released= req.body.released || Blog[req.params.id].released;
    Blog[req.params.id].hidden  = req.body.hidden   || Blog[req.params.id].hidden;
    Blog[req.params.id].tags    = req.body.tags     || Blog[req.params.id].tags;

    fs.writeFile('./data/blog.json', JSON.stringify(Blog), 'utf-8', (err) => {
        if (err) {
            res.status(500).json({error: err});
        } else {
            res.status(200).json(Blog[req.params.id]);
        }
    });
})

// DELETE Routen
//##################################################################
app.delete('/api/V1/blog/:id', function (req, res) {
    console.log('DELETE: /api/V1/blog/:id !')
    delete Blog[req.param.id]; //Kein Persistentes löschen in Datei aus Bequemlichkeit
     
})

//POST Routen
//##################################################################
app.post('/api/V1/blog', function (req, res) {
    // if (!res.locals.authenticated) {
    //     res.status(401).send('You are not authorized');
    //     return;
    // }

    if (!req.body.title || !req.body.picture || !req.body.author || !req.body.about || !req.body.released || !req.body.hidden || !req.body.tags) {
        res.status(400).send('Something is missing!');
        return;
    }

    var newIndex = blog.length;
    while (blog.filter((element) => { return element.index == newIndex}).length > 0) {
        newIndex += 1;
    }

    var newBlogPost = {
    _id     : new ObjectID(),
    index   : newIndex,
    title   : req.body.title,
    picture : req.body.picture,
    author  : req.body.author,
    about   : req.body.about,
    released: req.body.released,
    hidden  : req.body.hidden,
    tags    : req.body.tags
  };

  blog.push(newBlogPost);

  fs.writeFile('./data/blog.json', JSON.stringify(blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.status(201).json({index: newIndex, id: newBlogPost._id});
    }
  });
  
})

// Funktion um Json Datei nach Element zu durchsuchen 

