const router = require("express").Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const Admin = require("../models/Admin");
const Project = require("../models/Project");

//Title, SubHeading, Description, Authors

router.post("/addProject", async (req, res) => {
	const { title, subHeading, description, authors, image } = req.body;
	try {
		const newProject = new Project(req.body).save();
		if (newProject) {
			res.status(200).json({ message: "Project Created Succesfully!" });
			return;
		}
		res.status(200).json({ message: "Some Error Ocurred While Creating A Project" });
		return;
	} catch (error) {
		res.status(400).json({ message: "Error Creating A Project" });
		return;
	}
});

router.delete("/deleteProject", fetchAdmin, async (req, res) => {
	const { id } = req.query;

	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) res.status(400).json({ messgae: "Need Admin Rights To Remove An Event" });
		if (!id) res.status(400).json({ messgae: "Invalid request!" });

		const resp = await Project.findByIdAndDelete(id);
		return res.status(201).json({ message: "Project deleted successfully!" });
	} catch (error) {
		res.status(400).json(error);
		return;
	}
});

router.put("/makeFeaturedProject/:id", fetchAdmin, async (req, res) => {
	const id = req.params.id;
	try {
		console.log(id);
		const admin = await Admin.findById(req.admin.id);

		if (!admin) return res.status(200).json({ message: "Admin Rights Required" });

		const featuredProjects = await Project.find({ featured: true });

		if (featuredProjects.length > 0) {
			await Project.updateMany({ featured: true }, { $set: { featured: false } });
		}

		const project = await Project.findByIdAndUpdate(id, { featured: true });

		if (project) {
			res.status(200).json({ message: "Project Featured Succesfully!" });
			return;
		}
		res.status(200).json({ message: "Some Error Ocurred While Creating A Project" });
		return;
	} catch (error) {
		res.status(400).json({ message: "Error Creating A Project" });
		return;
	}
});

router.get("/getProject", async (req, res) => {
	const { title, id } = req.query;
	try {
		if (title) {
			const projects = await Project.find({ title: title });
			if (projects.length > 0) {
				res.status(200).json(projects);
				return;
			}
			res.status(200).json({ message: "No Such Events Has Been Planned Till Now" });
			return;
		} else if (id) {
			const project = await Project.findById(id);
			if (project) {
				res.status(200).json(project);
				return;
			}
			res.status(200).json({ message: "No Such Event Exists" });
			return;
		} else {
			const projects = await Project.find({ featured: false });
			res.status(200).json(projects);
			return;
		}
	} catch (error) {
		res.status(200).json(error);
		return;
	}
});

router.get("/getFeaturedProject", async (req, res) => {
	try {
		const projects = await Project.findOne({ featured: true });
		res.status(200).json(projects);
		return;
	} catch (error) {
		res.status(200).json(error);
		return;
	}
});

module.exports = router;
