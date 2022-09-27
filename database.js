const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log('Mongo connected!')
    } catch(e) {
        console.log('Error mongoose', e)
    }
}
module.exports = connectDB;