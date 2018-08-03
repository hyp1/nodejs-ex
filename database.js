"use strict"
var mongodb = require('mongodb');

// database.js
//https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {

    var m = mongodb;
    this.DbConnection = {};

    this.setup=function(url) {
    
        if (url == null) return;
            
        if (mongodb == null) return;
      
        this.DbConnection = m.connect(url);
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
