var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to / should return 200', function(done){
        chai.request(reqServer)
        .get('/indwex.html')
        .end(function(err, res) {
            console.log(res)
            res.should.have.status(200);
            done();
        })
    })

    it('GET to /about should return 200', function(done){
        chai.request(reqServer)
        .get('/index.html')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })
})
