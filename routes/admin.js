const mongoose = require('mongoose');
let Customer = require('../models/admin');
let express = require('express');
let router = express.Router();

//let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';
//let mongodbUri ='mongodb://YueWang:bookings999@ds131373.mlab.com:31373/bookingsdb';
//let mongodbUri ='mongodb://YueWang:donations999@ds161112.mlab.com:61112/heroku_mpgt8g57';
let mongodbUri ='mongodb://YueWang:donations999@ds149744.mlab.com:49744/heroku_l26pm7pk';
mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/customersdb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] in mLab.com ');
});

router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email},function (err, admin) {
        if(!admin)
            res.json({ message: 'admin NOT found!', errmsg : err });
        else{
            if(req.body.password === admin.password){
                //let token = customer.generateAuthToken();
                //res.header('x-auth-token',token);
                res.json({ message: 'Login Successfully!', data: admin });
            }
            else
                res.json({ message: 'Incorrect email Address or Password!', errmsg : err });
        }
    });
}
module.exports = router;