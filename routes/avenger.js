const router = require('express').Router();
const fetchAdmin = require('../middleware/fetchAdmin');
const Admin = require('../models/Admin');
const Avenger = require('../models/Avenger');
var cloudinary = require('cloudinary').v2;

router.post('/requestAvenger', async (req, res) => {
    const { name, email, phone, dateOfBirth, skills, social, image, response } = req.body;
    console.log(req.body);
    try {
        const existingAvenger = await Avenger.findOne({ email });
        console.log(!existingAvenger)
        if (!existingAvenger) {
            const newAvenger = new Avenger(req.body)
            const avenger = await newAvenger.save();
            console.log("Saved")
            res.status(200).json(avenger)
            return;
        }
        res.status(400).json({ message: 'Avenger Already Exists' })
        return;
    } catch (error) {
        res.status(400).json({ error: error });
        return
    }
});

router.get('/getAvenger', async (req, res) => {
    try {
        const { id, email, name, cond } = req.query;
        if (email) {
            const avenger = await Avenger.findOne({ email });
            if (avenger) {
                res.status(200).json(avenger)
                return;
            }
            res.status(400).json({ messgae: 'Avenger Doesn\'t Exists' });
            return;
        } else if (name) {
            const avenger = await Avenger.find({ name });
            if (avenger) {
                res.status(200).json(avenger)
                return;
            }
            res.status(400).json({ messgae: 'Avenger Doesn\'t Exists' });
            return;
        } else if (id) {
            const avenger = await Avenger.findById(id);
            if (avenger) {
                res.status(200).json(avenger)
                return;
            }
            res.status(400).json({ messgae: 'Avenger Doesn\'t Exists' });
            return;
        } else if(cond) {
            const rookies = await Avenger.find({ verified: true });
            res.status(200).json(rookies)
            return;
        } else {
            const rookies = await Avenger.find({ verified: false });
            res.status(200).json(rookies)
            return;
        }
    } catch (error) {
        res.status(400).json({ error: error });
        return
    }
})

router.put('/acceptAvenger/:id', fetchAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');

        if (!admin) return res.status(400).json({ message: 'Admin Rights Required' });

        const avenger = await Avenger.findById(req.params.id);
        console.log(avenger);

        if(!avenger) return res.status(400).json({ message: 'No Such Request Exists'});
        await avenger.updateOne({verified: true})
        res.status(200).json({message: 'Succesfully Accepted Avenger Request'})
        return;
    } catch (error) {
        res.status(400).json({ message: 'Cannot Accept The Request' });
        return;
    }
})

router.delete('/rejectAvenger/:id', fetchAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) return res.status(400).json({ message: 'Admin Rights Required' });

        const avenger = await Avenger.findOne({ id: req.params.id, verified: false });
        console.log(avenger)

        if(!avenger) return res.status(400).json({message: 'No Such Document Found'});

        const imageUrl = avenger.image.split('/')[7].split('.')[0]
        console.log(imageUrl)

        cloudinary.uploader.destroy(imageUrl).then((result)=>console.log(result));
        await avenger.deleteOne();

        res.status(200).json({message: 'Deleted Successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Cannot Delete The Request' });
    }
})

module.exports = router;
