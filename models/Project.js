const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authors: [
        { type: String, required: true }
    ],
    image: {
        type: String,
        required: true,
    },
    github: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Project', ProjectSchema);