const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');


const connectDatabase = async (options = {}) => {
    try{
        console.log('Connecting to MongoDB...: ', mongodbURL);
        await mongoose.connect(mongodbURL, options);
        console.log('MongoDB connected');
        mongoose.connection.on('error', error => {
            console.error('MongoDB connection error: ', error);
        });
    }catch(error){
        console.log('Could not connect to MongoDB: ', error.toString());
    }
}

module.exports = connectDatabase;