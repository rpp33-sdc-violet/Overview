var mongoose = require('./dbConnection.js');

//document = row
//model = 1 table

var { Schema } = mongoose;
var productSchema = new Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }]
});
var featureSchema = new Schema({
  id: Number,
  product_id: Number,
  feature: String,
  value: String
});

module.exports.productModel = mongoose.model('Product', productSchema, 'products');
module.exports.featureModel = mongoose.model('Feature', featureSchema, 'features');

