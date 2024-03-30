const router = require("express").Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const Admin = require("../models/Admin");
const Rookie = require("../models/Rookie");
var cloudinary = require("cloudinary").v2;

router.post("/requestRookie", async (req, res) => {
	const { name, email, phone, dateOfBirth,image, gender, year} = req.body;
	console.log(req.body);
	try {
		const existingRookie = await Rookie.findOne({ email });
		if (!existingRookie) {
			const newRookie = new Rookie({
				name,
				email,
				gender,
				phone,
				dateOfBirth,
				image,
				year
			});
			const rookie = await newRookie.save();
			res.status(200).json(rookie);
			return;
		}
		res.status(400).json({ message: "Rookie Already Exists" });
		return;
	} catch (error) {
		res.status(400).json({ error: error });
		return;
	}
});

router.delete("/deleteRookie", fetchAdmin, async (req, res) => {
	const { id } = req.query;

	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) res.status(400).json({ messgae: "Need Admin Rights To Remove An Event" });
		if (!id) res.status(400).json({ messgae: "Invalid request!" });

		const resp = await Rookie.findByIdAndDelete(id);
		return res.status(201).json({ message: "Rookie deleted successfully!" });
	} catch (error) {
		console.log(error);
		res.status(400).json(error);
		return;
	}
});

router.get("/getRookieReq", async (req, res) => {
    try {
        const rookies = await Rookie.find({ verified: false });
        res.status(200).json({ rookies });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





router.get("/getRookie", async (req, res) => {
	try {
		const { id, email, name, cond } = req.query;
		if (email) {
			const rookie = await Rookie.findOne({ email });
			if (rookie) {
				res.status(200).json(rookie);
				return;
			}
			res.status(400).json({ messgae: "Rookie Doesn't Exists" });
			return;
		} else if (name) {
			const rookie = await Rookie.find({ name });
			if (rookie) {
				res.status(200).json(rookie);
				return;
			}
			res.status(400).json({ messgae: "Rookie Doesn't Exists" });
			return;
		} else if (id) {
			const rookie = await Rookie.findById(id);
			if (rookie) {
				res.status(200).json(rookie);
				return;
			}
			res.status(400).json({ messgae: "Rookie Doesn't Exists" });
			return;
		} else if (cond) {
			const rookies = await Rookie.find({ verified: true });
			res.status(200).json(rookies);
			return;
		} else {
			const rookies = await Rookie.find({ verified: false });
			res.status(200).json(rookies);
			return;
		}
	} catch (error) {
		res.status(400).json({ error: error });
		return;
	}
});

router.put("/acceptRookie/:id", fetchAdmin, async (req, res) => {
	try {
		const admin = await Admin.findById(req.admin.id).select("-password");
		// console.log(admin)

		if (!admin) return res.status(400).json({ message: "Admin Rights Required" });

		const rookie = await Rookie.findById(req.params.id);
		console.log(rookie);

		if (!rookie) res.status(400).json({ message: "Rookie Not Found" });

		console.log("Here");
		console.log(rookie);

		if (!rookie) return res.status(400).json({ message: "No Such Request Exists" });
		await rookie.updateOne({ verified: true });
		console.log(rookie);
		res.status(200).json({ message: "Succesfully Accepted Rookie Request" });
		return;
	} catch (error) {
		res.status(400).json({ message: "Cannot Accept The Request" });
		return;
	}
});

router.delete("/rejectRookie/:id", fetchAdmin, async (req, res) => {
	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) return res.status(400).json({ message: "Admin Rights Required" });

		const rookie = await Rookie.findOne({ id: req.params.id, verified: false });
		console.log(rookie);

		if (!rookie) return res.status(400).json({ message: "No Such Document Found" });

		const imageUrl = rookie.image.split("/")[7].split(".")[0];
		console.log(imageUrl);

		cloudinary.uploader.destroy(imageUrl).then((result) => console.log(result));
		await rookie.deleteOne();

		res.status(200).json({ message: "Deleted Successfully" });
	} catch (error) {
		res.status(400).json({ message: "Cannot Delete The Request" });
	}
});

module.exports = router;
