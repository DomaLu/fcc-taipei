'use strict';

var ObjectID = require('mongodb').ObjectID;

function inputHandler (db) {
  var posts = db.collection('posts');

  // GET API
  var self = this;
  this.getPosts = function (req, res) {
    // var projection = { '_id': false };
    console.log(self);
    var projection = {};
    // var projection = 

    posts.find({}, projection).toArray( function (err, result) {
      if (err) { 
        throw err; 
      }
      
      res.send(result);
      //console.log(result);
    });
  };
  
  this.getPost = function (req, res) {
    var id = new ObjectID(req.params.id);
    console.log('get one id: ' + id);
    posts.find({_id: id}).toArray( function (err, result) {
      if (err) { 
        throw err; 
      }
      
      res.send(result);
      console.log(result);
    });
  };
  
  // POST API
  this.post = function(req, res){
    req.on('data', function(data) {
      // console.log(typeof data);
      //console.log(JSON.stringify(data.body));
      var record = {};
      data = JSON.parse(data);
      console.log(data);
      record.body = data.body;
      record.title = data.title;
      record.date = new Date();
      // console.log(JSON.stringify(record));
      posts.insert(record);
    }).setEncoding("utf8");
    
    req.on('end', function() {
       res.writeHead(200);
       res.end();
    });
  }; 
  
  // PUT API
  this.editPost = function(req, res) {
    req.on('data', function(data) {
      data = JSON.parse(data);
      console.log("Updating record: " + data.id);
      var id = new ObjectID(data.id);
      console.log(id);
  
      if (data.body != undefined) {
        posts.update({_id : id}, { $set : { body : data.body } });        
      }
  
      if (data.title != undefined) {
        posts.update({_id : id}, { $set : { title : data.title } });        
      }
    }).setEncoding("utf8");

    req.on('end', function() {
       res.writeHead(200);
       res.end();
    });
  };



  // DELETE API
  this.removePost = function(req, res) {
    // console.log(req.query);
    console.log(typeof req.query);
    // req.on('data', function(data) {
    // var data = JSON.parse(req.query);
    var data = req.query;
    console.log("Deleting record: " + data.id);
    var id = new ObjectID(data.id);
    posts.remove({_id: id});
    // }).setEncoding("utf8");

    // req.on('end', function() {
    res.writeHead(200);
    res.end();
    // });
  };
  


}

module.exports = inputHandler;
