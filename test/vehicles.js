var vehicle = require("../routes/vehicles");
var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect();
var server = require('../app');

chai.use(chaiHttp);

describe('Vehicle tests', function () {
    it('Vehicle tests Health2', function (done) {
        chai.request(server)
            .get('/vehicles')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET/:id vehicle', function () {
    it('it should GET vehicle Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1234)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.keys(['vin', 'color', 'doorCount', 'driveTrain' ]);
                res.body.vin.should.be.a('string');
                res.body.color.should.be.a('string');
                res.body.doorCount.should.be.a('number');
                res.body.driveTrain.should.be.a('string');
                done();
            });
    });
    it('it should NOT GET vehicle Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1435)
            .end(function (err, res) {
                res.should.be.json;
                res.should.have.not.status(200);
                res.body.should.have.property('error');
                done();
            });
    });
});

describe('/GET/:id/doors vehicle', function () {
    it('it should GET vehicle Door Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1234 + '/doors')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                //should(res.body).should.have.deep.property('location');
                //res.body.should.have.deep.property('locked');
                done();
            });
    });
    it('it should NOT GET vehicle Door Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1435 + '/doors')
            .end(function (err, res) {
                res.should.be.json;
                res.should.have.not.status(200);
                res.body.should.have.property('error');
                done();
            });
    });
});

describe('/GET/:id/fuel vehicle', function () {
    it('it should GET vehicle Fuel Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1234 + '/fuel')
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('percent');
                res.body.percent.should.be.a('number');
                done();
            });
    });
    it('it should NOT GET vehicle Fuel Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1435 + '/fuel')
            .end(function (err, res) {
                res.should.be.json;
                res.should.have.not.status(200);
                res.body.should.have.property('error');
                done();
            });
    });
});

describe('/GET/:id/battery vehicle', function () {
    it('it should GET vehicle Battery Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1234 + '/battery')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('percent');
                res.body.percent.should.be.a('number');
                done();
            });
    });
    it('it should NOT GET vehicle Battery Details by id', function (done) {
        chai.request(server)
            .get('/vehicles/' + 1435 + '/battery')
            .end(function (err, res) {
                res.should.be.json;
                res.should.have.not.status(200);
                res.body.should.have.property('error');
                done();
            });
    });
});

describe('/POST/:id/engine vehicle', function () {
    it('it should POST vehicle Engine action as START', function (done) {
        var postBody = {
            action: "START"
        }
        chai.request(server)
            .post('/vehicles/' + 1234 + '/engine')
            .send(postBody)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('status');
                res.body.status.should.be.a('string');
                done();
            });
    });
    it('it should POST vehicle Engine action as STOP', function (done) {
        var postBody = {
            action: "STOP"
        }
        chai.request(server)
            .post('/vehicles/' + 1234 + '/engine')
            .send(postBody)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('status');
                res.body.status.should.be.a('string');
                done();
            });
    });
    it('it should retun error POST vehicle Engine action', function (done) {
        var postBody = {
            action: "START"
        }
        chai.request(server)
            .post('/vehicles/' + 1435 + '/engine')
            .send(postBody)
            .end(function (err, res) {
                res.should.be.json;
                res.should.have.not.status(200);
                res.body.should.have.property('error');
                done();
            });
    });
});




