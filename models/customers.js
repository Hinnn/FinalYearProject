/*const customers = [
    {customerID: 100000000,name : "Yvette",email : "Y1234@qq.com", password : 123456,num : 1, date : 20081022},
    {customerID: 100000001,name :"Shaw", email : "HIA@gmail.com", password : 12345678, num : 1, date : 20181116},
    {customerID: 100000002,name :"Cathy", email : "Cathy123@163.com", password :123456, num :1, date :20081116}
];

module.exports = customers;*/

let mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
        customerID: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }

    },
    { collection: 'customers' });


module.exports = mongoose.model('Customer', CustomerSchema);