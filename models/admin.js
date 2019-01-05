
let mongoose = require('mongoose');

let AdminSchema = new mongoose.Schema({
        adminID: {
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
    { collection: 'admin' });


module.exports = mongoose.model('Admin', AdminSchema);