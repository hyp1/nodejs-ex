var chai     = require('chai');
var   expect   = chai.expect;

describe('DBTESTS',function(){
   
    var instance=require('../database');
      before(function(done) {
 
        db2 = instance.DbConnection;
       done()
        console.log("before");
    })
    after(function(done) {
        console.log("after");
        done()
    });
    afterEach(function(done) {
        console.log("afterEach");
         done()
    });
/*
      
    it('counts should be a collection', function(done){
     var   expect   = chai.expect;

        if (!db2) console.error('Keine Datenbank!')
        db2.then(function(db2) {
         db2.collection('counts').find({}).toArray(function(err, resultArray){console.log(resultArray)});
        }).then(done);
 
      //   done();
    })
    
    it('Expext Object', function(done) {
        //console.log(db2);
    
        db2.then(function(data){
            console.log(data.databaseName,'data');
            expect(data.databaseName).to.equal('admin');
            done()
        })
    
  
    });
    */

    it('should return the square root of a given positive number', function() {
            expect(Math.sqrt(25)).to.be.equal(5);
        });

})