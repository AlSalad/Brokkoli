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
    //console.log('PUT: /api/v1/login !') 

    if (req.body.username != User.username || req.body.password != User.password) {
        res.status(401).send('Wrong Login');
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour exipry
        username: User.username
    }, 'asdf');

    res.status(200).json({
        token: token
    });
})

module.exports = function(req, res, next) {
  // if no token was provided or could not be verified, the request is not authenticated
  res.locals.authenticated = false;
  // look for the token
  var token = req.headers['x-bernd-token'];
  if (token) {
    try {
      var decodedJwt = jwt.verify(token, 'asdf');
      res.locals.authenticated = true;
      res.locals.token = decodedJwt;
    } catch (e) {
    }
  }
  next();
}


app.put('/api/V1/passwordRecovery', function (req, res) {
    console.log('PUT: /api/V1/passwordRecovery !')
     
})

app.put('/api/V1/blog/:id', function (req, res) {
    console.log('PUT: /api/V1/blog/:id !')
     
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
    console.log('POST: /api/v1/blog !')
})

// Funktion um Json Datei nach Element zu durchsuchen 

