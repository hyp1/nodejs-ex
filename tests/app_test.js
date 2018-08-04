var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

    var expect = require('chai').expect;
    chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {


    it('GET to / should return 200', function(done){
        chai.request(reqServer)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    it('GET to /about should return 200', function(done){
        chai.request(reqServer)
        .get('/about')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })        
    })
    
  
})

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

 
    it('should return the square root of a given positive number', function() {
            expect(Math.sqrt(25)).to.be.equal(5);
        });

})