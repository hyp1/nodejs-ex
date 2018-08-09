"use strict"
var mongodb = require('mongodb');

// database.js
//https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {

    var MongoClient = mongodb.MongoClient;
    this.DbConnection = {};
    this.setup=function(url) {
        if (!url  && !mongodb){
            console.errot('Failed ui setup MongoDB connecion: '+url,'Error')
            return;
        }         
        this.DbConnection = MongoClient.connect(url);
      };


    this.insert=function(table,data){
        this.DbConnection.then(function(db) {
        var col = db.collection(table);
        // Create a document with request IP and current time of request
        col.insert(data).then(function(data){
            console.log(data," database:DBInsert ok");

        }).catch(function(err){
            console.error("database:DBInsert error flushBuffer key exists");

        });
            col.count(function(err, count){
            console.error('database:DBINSERT '+JSON.stringify(data)+' COUNT:'+count)
            return count;
            });
        },table,data).catch(function(err){
            console.error(data,"database:DBCollection error.");
        });
    };    
};

singleton.instance = null;

singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
};


module.exports = singleton.getInstance();
