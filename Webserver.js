const express = require('express')
var bodyParser = require('body-parser');
const app = express()

var fs = require("fs");
var path = require("path");
var Blog = require('./blog.json'); 
var User = require('./user.json'); 
var jwt = require('jsonwebtoken');



 // for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, function () {
  console.log('Webserver listening on port 3000!') 
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



//GET kompletten Blog´
//##################################################################
app.get('/api/V1/blog'  , checkLogin ,function (req, res) {
  
    if (app.locals.authenticated == true ){
        res.json(Blog);
    }
    else {
        res.json(Blog.filter((element) => {
      return !element.hidden;
    }));
    }
  })


//GET spezifischen Blogeintrag
//##################################################################
app.get('/api/V1/blog/:id',checkLogin, function (req, res) {

    //Wenn nicht eingeloggt
    if (Blog[req.params.id].hidden && app.locals.authenticated == false) {
        res.status(401).send('You are not authorized');
        return;
    }
    res.json(Blog[req.params.id]);
})

//Log In
//##################################################################
app.put('/api/V1/login',  function (req, res) { 

  if (req.body.username != User.username || req.body.password != User.password) {
    res.status(403).send('Authentification failed')
    return;
  }
   else {    
    var token = jwt.sign({
        //2 Stunden aktiv
        exp: Math.floor(Date.now() / 1000) + (60 * 120), 
        username: User.username
      }, 'secret');
   app.locals.token = token;
  
    res.status(200).json({
        token: token
    });
}})

//Password Recovery
app.put('/api/V1/passwordRecovery', function (req, res) {
    console.log('PUT: /api/V1/passwordRecovery !')     
})


//EDIT Blog entry
//##################################################################
app.put('/api/V1/blog/:id',checkLogin,  function (req, res) {   
    
    if (!Blog[req.params.id]) {
        res.status(404).send('ID not existing');
        return;
    }

       if (app.locals.authenticated == false && Blog[req.params.id].hidden ==true) {
         res.status(401).send('Not authorized!');
         return;
       }

    Blog[req.params.id].title   = req.body.title    || Blog[req.params.id].title;
    Blog[req.params.id].picture = req.body.picture  || Blog[req.params.id].picture;
    Blog[req.params.id].author  = req.body.author   || Blog[req.params.id].author;
    Blog[req.params.id].about   = req.body.about    || Blog[req.params.id].about;
    Blog[req.params.id].released= req.body.released || Blog[req.params.id].released;
    Blog[req.params.id].hidden  = req.body.hidden   || Blog[req.params.id].hidden;
    Blog[req.params.id].tags    = req.body.tags     || Blog[req.params.id].tags;

    fs.writeFile('blog.json', JSON.stringify(Blog), 'utf-8', (err) => {
        if (err) {
            res.status(500).json({error: err});
        } else {
            res.status(200).json(Blog[req.params.id]);
        }
    });
})

// DELETE Routen
//##################################################################
app.delete('/api/V1/blog/:id', checkLogin, function (req, res) {
    
     
    if (app.locals.authenticated == false && Blog[req.params.id].hidden ==true) {
         res.status(401).send('Not authorized!');
         return;
       } 

       delete Blog[req.params.id]; //Kein Persistentes löschen in Datei aus Bequemlichkeit
       //res.status(200).json("Erfolgreich gelöscht!");
       console.log(Blog);
       fs.writeFile('blog.json', JSON.stringify(Blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.status(200).json("Erfolgreich gelöscht!");
    }
  }); 
})

//POST Routen
//##################################################################
app.post('/api/V1/blog', checkLogin, function (req, res) {
    
    console.log("App.locals.token"+ app.locals.token); 
    console.log ("Ausgelesener Token aus Header:" + req.headers.token);


     if (app.locals.authenticated == false) {
         res.status(401).send('You are not authorized');
         return;
     }
       

    if (!req.body.title || !req.body.picture || !req.body.author || !req.body.about || !req.body.released || !req.body.hidden || !req.body.tags) {
        res.status(400).send('We need more Information!');
        return;
    }

    var newIndex = Blog.length;
    while (Blog.filter((element) => { return element.index == newIndex}).length > 0) {
        newIndex += 1;
    }

    //console.log("Drinnen");
    var newBlogPost = {
    
    _id     : Math.random(), //Hier müssen wir noch eine gescheite ID kreieren
    index   : newIndex,
    title   : req.body.title,
    picture : req.body.picture,
    author  : req.body.author,
    about   : req.body.about,
    released: req.body.released,
    hidden  : req.body.hidden,
    tags    : req.body.tags
  };

  // String to Bool for hidden 
if (newBlogPost.hidden == "false") {
    newBlogPost.hidden = false;
}
else {newBlogPost.hidden = true;
}

  Blog.push(newBlogPost);

  fs.writeFile('blog.json', JSON.stringify(Blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.status(201).json({index: newIndex, id: newBlogPost._id});
    }
  });
  //var Blog = require('./blog.json'); 
})



function checkLogin(req, res, next){

    //console.log("App.locals.token"+ app.locals.token); 
    //console.log ("Ausgelesener Token aus Header:" + req.headers.token);
    
    if (app.locals.token == req.headers.token) {
        app.locals.authenticated = true;

        if (req.headers.token =="" || req.headers.token == undefined ) {
        app.locals.authenticated = false; 
         }
    }
    else {
        app.locals.authenticated = false;}
   //console.log("Gesetztezter Wert authenticated: " + app.locals.authenticated);
   next();
   
}


