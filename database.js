"use strict"
var mongodb = require('mongodb');

// database.js
//https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {

    var MongoClient = mongodb.MongoClient;
    this.DbConnection = {};

    this.setup=function(url) {
    
        if (url == null) return;
            
        if (mongodb == null) return;
      
        this.DbConnection = MongoClient.connect(url);
      };


    this.insert=function(table,data){
        this.DbConnection.then(function(db) {
    var col = db.collection(table);
    // Create a document with request IP and current time of request
    col.insert(data);
    col.count(function(err, count){
      console.log('DBINSERT '+JSON.stringify(data)+' COUNT:'+count)
       return count;
    });

},table,data);

      }

    
};

singleton.instance = null;

singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
};

singleton.insert = function(){
    //    console.log())=
        return 
    };
  

module.exports = singleton.getInstance();
