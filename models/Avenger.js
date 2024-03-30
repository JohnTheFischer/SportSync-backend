const mongoose = require('mongoose')

const AvengerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    phone: {
        type: String,
        required: true,
        // unique: true
    },
    dateOfBirth: {
        type: Date,
    },
    skills: [
        { type: String, required: true },
    ],
    social: {
        type: Map,
        of: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    tag: {
        type: String,
        // required: false,
    },
    post: {
        type: String,
        // required: false,
    },
    desc: {
        type: String,
        // required: false,
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Avenger', AvengerSchema)