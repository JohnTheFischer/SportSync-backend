const mongo = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

mongo.set('strictQuery', true);

const connectToMongo = () => {
    mongo.connect(process.env.MONGO_DB_URI).then(console.log('Connection Successful')).catch(error => console.log(error))
}
module.exports = connectToMongo