var mongoose = require('./dbConnection.js');
var { Schema } = mongoose;

//document = row
//model = 1 table

var productSchema = new Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }], //ref Model/Table name
  relatedProducts: [Number],
  styles: [{ type: Schema.Types.ObjectId, ref: 'Style' }]
});
var featureSchema = new Schema({
  id: Number,
  product_id: Number,
  feature: String,
  value: String
});
var relatedSchema = new Schema({
  id: Number,
  current_product_id: Number,
  related_product_id: Number
});
var skuSchema = new Schema({
  id: Number,
  styleId: Number,
  quantity: Number,
  size: String
});
var styleSchema = new Schema({
  id: Number,
  productId: Number,
  name: String,
  sale_price: String,
  original_price: String,
  default_style: Boolean,
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }], //ref Model/Table name
  skus: [{ type: Schema.Types.ObjectId, ref: 'Sku' }]
});
var photoSchema = new Schema({
  id: Number,
  styleId: Number,
  url: String,
  thumbnail_url: String
});

// Last arguement is the collection name in mongoDB (usually plurals)
// First argument is usally a singular of the last arg.

module.exports.productModel = mongoose.model('Product', productSchema, 'products');
module.exports.featureModel = mongoose.model('Feature', featureSchema, 'features');
module.exports.relatedModel = mongoose.model('Related', relatedSchema, 'related');
module.exports.skuModel = mongoose.model('Sku', skuSchema, 'skus');
module.exports.styleModel = mongoose.model('Style', styleSchema, 'styles');
module.exports.photoModel = mongoose.model('Photo', photoSchema, 'photos');
