var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SDC')
mongoose.connection.on('error', err => {
  logError('mongoose connection err: ', err);
});

//document = row
//model = 1 table

var { Schema } = mongoose;
var productSchema = new Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String
});
var featureSchema = new Schema({
  id: Number,
  product_id: Number,
  feature: String,
  value: String,
});

module.exports.productModel = mongoose.model('Product', productSchema, 'products');
module.exports.featureModel = mongoose.model('Feature', featureSchema, 'features');


