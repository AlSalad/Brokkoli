const express = require('express')
const app = express()
var fs = require("fs");
var path = require("path");

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

// Get Routen
//##################################################################
app.get('/api/V1/blog', function (req, res) {
    console.log('GET: /api/v1/blog returned!')
     
     res.sendFile(path.normalize(__dirname + '/blog.json', 'utf8'))
})

app.get('/api/V1/blog/:id', function (req, res) {
  console.log('GET: /api/V1/blog/:id returned!')
    res.send('Hello World!')
})

// PUT Routen
//##################################################################
app.put('/api/V1/login', function (req, res) {
    console.log('PUT: /api/v1/login !')
    
})

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
     
})

//POST Routen
//##################################################################
app.post('/api/V1/blog', function (req, res) {
    console.log('POST: /api/v1/blog !')
     
})
