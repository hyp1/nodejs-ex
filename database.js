var mongodb = require('mongodb');

// database.js
https://stackoverflow.com/questions/33797732/global-module-object-in-node-js
var singleton = function singleton() {//

    var MongoClient = mongodb.Db;
    this.DbConnection = {};
    this.setup=function(url,callback) {
        console.log(url);
        if (this.url == null) return;            
        if (mongodb == null) return;      
        DbConnection = MongoClient.connect(url);
        callback=DbConnection;

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
