const router = require('express').Router();
const Event = require('../models/Event');
const Project = require('../models/Project')

router.get('/getUpdates', async (req, res) => {
    try {

        const events = await Event.find({ date: { $gt: new Date } }).sort({date: -1})
        const projects = await Project.findOne().sort({ createdAt: -1 });
        const updates = {
            "events": events,
            "projects": projects
        }
        res.status(200).json(updates);
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router