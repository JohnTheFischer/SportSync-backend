const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchAdmin = require('../middleware/fetchAdmin');
const Admin = require('../models/Admin');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', fetchAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        console.log(admin.username);
        req.body.createdBy = admin.username;
        if (!!admin) {
            const usernameAdmin = await Admin.findOne({ username: req.body.username });
            if (usernameAdmin) {
                res.status(400).json({ message: 'Admin With This Username Already Exists' });
                return;
            }

            const emailAdmin = await Admin.findOne({ email: req.body.email });
            if (emailAdmin) {
                res.status(400).json({ message: 'Admin With This Email Already Exists' });
                return;
            }

            const salt = await bcrypt.genSalt(10);

            const hashedPass = await bcrypt.hash(req.body.password, salt);
            const newAdmin = new Admin({
                ...req.body,
                "password": hashedPass,
            })

            const admin = await newAdmin.save();

            const data = {
                admin: {
                    id: admin.id
                }
            }

            const adminToken = jwt.sign(data, JWT_SECRET)
            res.status(200).json(adminToken);
            return;
        } else {
            res.status(400).json('Admin Rights Needed');
        }
    } catch (error) {
        res.status(400).json({ message: 'Possession Of Admin Rights Intended!' });
        return;
    }
})


router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (!!!admin) {
            return res.status(400).json({ error: "Such Admin Does Not Exist" });
        }

        const passwordCompare = await bcrypt.compare(password, admin.password);

        if (!!!passwordCompare) {
            return res.status(400).json({ messgae: 'Wrong Password Entered' });
        }

        const data = {
            admin: {
                id: admin.id
            }
        }

        const adminToken = jwt.sign(data, JWT_SECRET)
        return res.status(200).json(adminToken);

    } catch (error) {
        res.status(400).json({ message: 'Cannot Sign You In Contact Support Team ;)' });
    }
})


router.delete('/deleteAdmin/:id', fetchAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        console.log(!!admin, admin.createdBy === 'system')

        if (!!admin) {

            if (admin.createdBy === 'system') {
                console.log(req.params.id);

                const adminDelete = await Admin.findById(req.params.id)
                console.log(adminDelete);

                if (!!adminDelete) {
                    if (adminDelete.createdBy === 'system') {
                        return res.status(400).json('Cannot Delete System Generated Admin');
                    }

                    const deleteAdmin = await Admin.findByIdAndDelete(req.params.id);
                    console.log(deleteAdmin);
                    return res.status(200).json({ message: 'Admin Deleted Successfully' });
                }

                return res.status(400).json({ message: 'Admin To Be Deleted Does Not Exist' });
            }
            return res.status(400).json({ message: 'You Do Not Have The Permission To Delete Other Admin' });
        }
        return res.status(400).json({ message: 'Such Admin Does Not Exist' });

    } catch (error) {
        return res.status(400).json({ message: 'Error In Authenticating' });
    }
})


router.get('/getAdmin/:id', async (req, res) => {
    const admin = await Admin.findById(req.params.id)
    res.status(200).json(admin);
})


router.get('/getAdmin', fetchAdmin, async (req, res) => {
    const admin = await Admin.find().select('-password')
    res.status(200).json(admin);
})

module.exports = router;