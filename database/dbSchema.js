var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SDC')
  //document = row
  //model = 1 table
mongoose.connection.on('error', err => {
  logError('mongoose connection err: ', err);
});

var { Schema } = mongoose;
var productSchema = new Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String
});

module.exports = mongoose.model('Product', productSchema, 'products');


