var mongoose = require('mongoose');
require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it working

// OPTION1: Using EC2 with PW
// mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.EC2_IP_DB}:27017/SDC`) // change back to localhost if using localhost // local machine ip : 192.168.1.39

// OPTION2: Using localhost in developement mode
mongoose.connect(`mongodb://localhost:27017/SDC`)

// OPTION3: Using EC2 without PW.
// mongoose.connect(`mongodb://ec2-18-136-119-244.ap-southeast-1.compute.amazonaws.com:27017/SDC`)

mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.log('mongoose connection err: ', err);
});

module.exports = mongoose;