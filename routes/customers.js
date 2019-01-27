let mongoose = require('mongoose');
let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/nodemailer');


let mongodbUri ='mongodb://YueWang:donations999@ds149744.mlab.com:49744/heroku_l26pm7pk';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] in mLab.com ');
});

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');

    let mail = {
        from: '"Yve Hotel"<wy20082242@126.com>',
        to: '772012459@qq.com',
        subject: 'Email Verification',
        html: '<h3>This is the verification email</h3>'

     };

    let customer = new Customer();
    customer.customerID = req.body.customerID;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.password2 = bcrypt.hashSync(req.body.password2);
    customer.phoneNumber = req.body.phoneNumber;
    customer.DateOfBirth = req.body.DateOFBirth;
    customer.Gender = req.body.Gender;
    customer.register_date = Date.now();
    customer.save(function (err) {
        if (err)
            res.json({message: 'Fail to Sign up !', errmsg: err});
        else
            mailer.send(mail, function () {
                //     if(error)
                //         res.json({message: 'Fail to send an email'});
                //         else
                //             res.json({message: 'Email sent successfully'})
                // });
                res.json({message: 'Sign up Successfully!'});
            });
            });
}


    router.login = (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        Customer.findOne({email: req.body.email}, function (err, customer) {
            if (!customer)
                res.json({message: 'Customer NOT found!', errmsg: err});
            else {
               /* if (req.body.password === customer.password) {
                    res.json({message: 'Login Successfully!', data: customer});
                }*/
                if(bcrypt.compareSync(req.body.password,customer.password)){
                    let token = customer.generateAuthToken();
                    res.header('token',token);
                    res.json({ message: 'Login Successfully!', data: customer });
                }
                else
                    res.json({message: 'Incorrect email Address or Password!', errmsg: err});
            }
        });
    }

    router.findAll = (req, res) => {
        // Return a JSON representation of our list
        res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(customers,null,5));
        Customer.find(function (err, customers) {
            if (err)
                res.send(err);

            res.send(JSON.stringify(customers, null, 5));
        });
    }
    router.findOne = (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        Customer.find({"email": req.params.email}, function (err, customer) {
            if (err)
                res.json({message: 'Customer NOT Found!', errmsg: err});
            else
                res.send(JSON.stringify(customer, null, 5));
        });
    }


    function getByValue(array, email) {
        var result = array.filter(function (obj) {
            return obj.email === email;
        });
        return result ? result[0] : null; // or undefined
    }

    router.EditInfo = (req, res) => {

        // Find the relevant booking based on params id passed in

        res.setHeader('Content-Type', 'application/json');
        let customer = new Customer({
            //customerID: req.body.customerID,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password),
            password2: bcrypt.hashSync(req.body.password2),
            DateOfBirth: req.body.DateOfBirth,
            Gender: req.body.Gender
        });
        Customer.update({"customerID": req.params.customerID},
            {
                name: req.body.name,
                //email: req.body.email,
                password: req.body.password,
                password2: req.body.password2,
                DateOfBirth: req.body.DateOfBirth,
                Gender: req.body.Gender
            },
            function (err, customer) {
                if (err)
                    res.json({message: 'Customer Not Edited', errmsg: err});
                else
                    res.json({message: 'Customer Edited successfully', data: customer});
            });
    };

    router.deleteCustomer = (req, res) => {
        Customer.findOneAndRemove({email: req.params.email}, function (err) {
            if (!err) {

                res.json({message: 'Customer Successfully Deleted!'});
            }
            else
            //remove(req.params.customerID);
            //res.json({message: 'Booking Successfully Deleted!'});
                res.json({message: 'Customer NOT Found!', errmsg: err});
        });
    }



module.exports = router;