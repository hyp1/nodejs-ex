"use strict"

// database.js
//https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {

    this.DbConnection = {};

    this.setup=function(url) {    
        if (url == null) return;
            
        if (mongodb == null) return;
        if (mongoURL == null) return;

        var mongodb = require('mongodb');
        if (mongodb == null) return;
       mongodb.connect(mongoURL, function(err, conn) {
          if (err) {
            callback(err);
            return;
          }
      
          this.DbConnection  = conn;
          dbDetails.databaseName = db.databaseName;
          dbDetails.url = mongoURLLabel;
          dbDetails.type = 'MongoDB';      
          console.log('Connected to MongoDB at: %s', mongoURL);
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
