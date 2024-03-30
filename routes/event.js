const router = require("express").Router();
const Event = require("../models/Event");
const fetchAdmin = require("../middleware/fetchAdmin");
const Admin = require("../models/Admin");

router.post("/addEvent", fetchAdmin, async (req, res) => {
	const { title, subHeadLine, description, venue, organizer, date } = req.body;

	try {
		const admin = await Admin.findById(req.admin.id);
		if (!!admin) {
			const event = await Event(req.body).save();
			res.status(200).json(event);
			return;
		}
		res.status(200).json({ message: "You Need Admin Rights To Create An Event" });
		return;
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

router.get("/getEvent", async (req, res) => {
	const { title, id } = req.query;
	try {
		if (title) {
			const events = await Event.find({ title: title }).sort({ date: -1 });
			if (events.length > 0) {
				res.status(200).json(events);
				return;
			}
			res.status(200).json({ message: "No Such Events Has Been Planned Till Now" });
			return;
		} else if (id) {
			const event = await Event.findById(id);
			if (event) {
				res.status(200).json(event);
				return;
			}
			res.status(200).json({ message: "No Such Event Exists" });
			return;
		} else {
			const events = await Event.find().sort({ date: -1 });
			res.status(200).json(events);
			return;
		}
	} catch (error) {
		res.status(200).json(error);
		return;
	}
});

router.delete("/deleteEvent", fetchAdmin, async (req, res) => {
	const { title, id } = req.query;
	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) res.status(400).json({ messgae: "Need Admin Rights To Remove An Event" });
		if (id) {
			const existingEvent = await Event.findById(id);
			console.log(existingEvent);
			if (existingEvent) {
				existingEvent.delete();
				res.status(200).json({ message: "Event Deleted Succesfully" });
				return;
			}

			res.status(200).json({ message: "No Such Event Exists" });
			return;
		} else if (title) {
			const existingEvent = await Event.findOne({ title, date: { $gt: Date.now() } });
			console.log(existingEvent);
			if (existingEvent) {
				existingEvent.delete();
				res.status(200).json({ message: "Event Deleted Succesfully" });
				return;
			}

			res.status(200).json({ message: "No Such Event Exists" });
			return;
		} else {
			res.status(400).json({ message: "Event To Be Delete, Not Specified" });
		}
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

module.exports = router;
