let datastore = require('../../models/customers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let mongoose = require('mongoose');

//let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';
//let mongodbUri ='mongodb://YueWang:donations999@ds161112.mlab.com:61112/heroku_mpgt8g57';
let mongodbUri ='mongodb://YueWang:donations999@ds149744.mlab.com:49744/heroku_l26pm7pk';
chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash');
let customer =[
    {     "customerID": 20082242,
        "name": "Yvette",
        "email": "Yvette@wit.ie",
        "password": "121323",
        "DateOfBirth": 19961212,
        "Gender": "female"
    },
    { "customerID": 130928111,
        "name": "Yue Wang",
        "email": "1095933649@qq.com",
        "password": "wangyue123",
        "phoneNumber": 830694220,
        "DateOfBirth": 19970114,
        "Gender": "female"
    },
    {
        "customerID": 10000323,
        "name": "Shaw",
        "email": "shaw@gmail.com",
        "password": "shaw123",
        "DateOfBirth": 19971116,
        "Gender": "male"
    }
]

let db = mongoose.connection;

describe('Customers', () => {
    before(function (done) {

        mongoose.connect(mongodbUri, {useNewUrlParser: true}, function (err) {
            if (err)
                console.log('Connection Error:' + err);
            else
                console.log(' ');
        });
        try {
            db.collection("customers").insertMany(customer);
        } catch (e) {
            print(e);
        }
        done();

    });
    after(function (done) {

        db.collection("customers").remove({'customerID': {$in: [20082242, 10000323, 130928111,21000000]}});
        done();
    });

    describe('POST /customers/signUp', function () {
        it('should return confirmation message and add a customer', function (done) {
            let customer = {
                "customerID": 21000000,
                "name": "Angle",
                "email": "angle@163.com",
                "password": "angle123",
                "DateOFBirth": 19961226,
                "Gender": "female"
            };
            chai.request(server)
                .post('/customers/SignUp')
                .send(customer)
                .end(function (err, res) {
                    // expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Sign up Successfully!');
                    done();

                });
        });
    });

    describe('POST /customers/login',()=> {
        describe('Log in successfully!', function () {
            it('should return a message for customer sign in successfully', function (done) {
                let customer = {
                    "email": "Yvette@wit.ie",
                    "password": "121323"
                };
                chai.request(server)
                    .post('/customers/login')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Login Successfully!');
                        done();

                    });
            });
        });
        describe('Username Not Found!', function () {
            it('should return a message for Username Not Found!', function (done) {
                let customer = {
                    "email": "Yvte@wit.ie",
                    "password": "121323",
                };
                chai.request(server)
                    .post('/customers/login')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Customer NOT found!');
                        done();

                    });
            });
        });
        describe('Wrong password!', function () {
            it('should return a message for Wrong password!', function (done) {
                let customer = {
                    "email": "Yvette@wit.ie",
                    "password": "2888913"
                };
                chai.request(server)
                    .post('/customers/login')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Incorrect email Address or Password!');
                        done();

                    });
            });
        });
    });

    describe('GET /customers', () => {
        it('should return all the customers in an array', function (done) {
            chai.request(server)
                .get('/customers')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (customer) => {
                        return {
                            customerID: customer.customerID,
                            name: customer.name,
                            email: customer.email,
                            password: customer.password,
                            DateOfBirth: customer.DateOfBirth,
                            Gender: customer.Gender
                        }
                    });
                    expect(result).to.include({
                        "customerID": 20082242,
                        "name": "Yvette",
                        "email": "Yvette@wit.ie",
                        "password": "121323",
                        "DateOfBirth": 19961212,
                        "Gender": "female"
                    });

                    done();
                });
        });
    });



 /*   describe('GET /customers/:customerID', () => {
        it('should return a customer with the specific customerID', function (done) {
            chai.request(server)
                .get('/customers/20082242')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (customer) => {
                        return {
                            customerID: customer.customerID,
                            name: customer.name,
                            email: customer.email,
                            password: customer.password,
                            DateOfBirth: customer.DateOFBirth,
                            Gender: customer.Gender
                        }
                    });
                    expect(result).to.include({
                        "customerID": 20082242,
                        "name": "Yvette",
                        "email": "Yvette@wit.ie",
                        "password": "121323",
                        "DateOfBirth": 19961212,
                        "Gender": "female"
                    });
                    done();

                });

        });
    });
*/

    describe('DELETE /customers/customerID', function () {
        describe('Customer Successfully Deleted!', function () {
            it('should return confirmation message and delete a customer', function (done) {
                chai.request(server)
                    .delete('/customers/21000000')
                    .end(function (err, res) {
                        done();

                    });
            });
                        after(function (done) {
                        chai.request(server)
                         .get('/customers')
                         .end(function (err, res) {
                        let result = _.map(res.body, (customer) => {
                            return {
                                customerID: customer.customerID,
                                name: customer.name,
                                email: customer.email,
                                password: customer.password,
                                DateOfBirth: customer.DateOfBirth,
                                Gender: customer.Gender
                            }
                        });
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        expect(result).to.include({
                            "customerID": 20082242,
                            "name": "Yvette",
                            "email": "Yvette@wit.ie",
                            "password": "121323",
                            "DateOfBirth": 19961212,
                            "Gender": "female"

                        });
                        done();
                    });
            });
        });


                describe('Customer Not Deleted!!', function () {
                    it('should return a message for customer not deleted', function (done) {
                        chai.request(server)
                            .delete('/customer/200822')
                            .end(function (err, res) {
                                expect(res).to.have.status(404);
                                done();

                            });
                    });
                    after(function (done) {
                        chai.request(server)
                            .get('/customers')
                            .end(function (err, res) {
                                let result = _.map(res.body, (customer) => {
                                    return {
                                        customerID: customer.customerID,
                                        name: customer.name,
                                        email: customer.email,
                                        password: customer.password,
                                        DateOfBirth: customer.DateOfBirth,
                                        Gender: customer.Gender
                                    }
                                });
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.equal(4);
                                expect(result).to.include({
                                    "customerID": 20082242,
                                    "name": "Yvette",
                                    "email": "Yvette@wit.ie",
                                    "password": "121323",
                                    "DateOfBirth": 19961212,
                                    "Gender": "female"
                                });

                            });
                        done();
                    });//end after
                });//end describe
            });
        });
//    });

//});

