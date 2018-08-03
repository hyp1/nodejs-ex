"use strict"


// database.js
//https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    this.DbConnection = {};

    this.setup=function(url) {
    
        if (url == null) return;
            
        if (mongodb == null) return;
      
        this.DbConnection = MongoClient.connect(url);
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
