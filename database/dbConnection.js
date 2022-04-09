var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SDC')
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  logError('mongoose connection err: ', err);
});

module.exports = mongoose;