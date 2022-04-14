var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/SDC') // change to db for docker purpose. // change back to localhost if using localhost
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.log('mongoose connection err: ', err);
});

module.exports = mongoose;