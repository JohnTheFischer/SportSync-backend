const router = require("express").Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const Admin = require("../models/Admin");
const Course = require("../models/Course");

router.post("/createCourse", fetchAdmin, async (req, res) => {
	const { title, description, link, tag, thumbnailImage } = req.body;
	const adminId = req.admin.id;
	try {
		const admin = await Admin.findById(adminId);
		console.log(admin);
		if (admin) {
			req.body.createdBy = adminId;
			console.log(req.body);
			const course = new Course(req.body);
			const savedCourse = await course.save();
			res.status(200).json(savedCourse);
			return;
		}
		res.status(400).json({ message: "Can't Add A Course" });
		return;
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

router.delete("/deleteCourse", fetchAdmin, async (req, res) => {
	const { id } = req.query;

	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) res.status(400).json({ messgae: "Need Admin Rights To Remove An Event" });
		if (!id) res.status(400).json({ messgae: "Invalid request!" });

		const resp = await Course.findByIdAndDelete(id);
		return res.status(201).json({ message: "Course deleted successfully!" });
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

router.get("/getCourses", async (req, res) => {
	try {
		const courses = await Course.find();
		res.status(200).json(courses);
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

module.exports = router;
