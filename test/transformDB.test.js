var mongoose = require('../database/dbConnection.js');
var { ObjectId } = mongoose.Types;

var ProductModel = require('../database/dbSchema.js').productModel;
var FeatureModel = require('../database/dbSchema.js').featureModel;
var RelatedModel = require('../database/dbSchema.js').relatedModel;
var StyleModel = require('../database/dbSchema.js').styleModel;
var PhotoModel = require('../database/dbSchema.js').photoModel;
var SkuModel = require('../database/dbSchema.js').skuModel;


describe('load process', () => {
 describe('product table', () => {
  it('', () => {
    
  })
 })
 describe('style table', () => {

})
 afterAll(()=>{
    mongoose.disconnect();
  });
});