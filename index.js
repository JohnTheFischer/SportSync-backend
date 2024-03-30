const express = require('express');
const connectToMongo = require('./db')
const cors = require("cors");

connectToMongo()

const app = express();
const PORT = 5001

// app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });


app.use('/api/rookie', require('./routes/rookie'))
app.use('/api/avenger', require('./routes/avenger'))
app.use('/api/event', require('./routes/event'))
app.use('/api/project', require('./routes/project'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/course', require('./routes/course'))
app.use('/api/announce', require('./routes/announcements'))


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
        

    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.listen(PORT, () => {
    console.log(`Your Server is Running on ${PORT}`);
})