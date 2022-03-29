var ProductModel = require('./dbSchema.js').productModel;
var FeatureModel = require('./dbSchema.js').featureModel;
var RelatedModel = require('./dbSchema.js').relatedModel;
var StyleModel = require('./dbSchema.js').styleModel;
var PhotoModel = require('./dbSchema.js').photoModel;
var SkuModel = require('./dbSchema.js').skuModel;
var mongoose = require('../database/dbConnection.js');
var Promise = require("bluebird");

var tranformProducts = async function () {
  // iterate over all products table id
  var products = await ProductModel.find({}).lean();
  // console.log('products:', products);

  for (var i = 1; i < products.length; i++) {
    // search feature with that product id
    var currentProductId = products[i].id;
    var conditionProductId = {"product_id": currentProductId};
    var conditionRelated_product_id = {"current_product_id": currentProductId};
    var conditionStyleId = {"productId": currentProductId};
    var conditionId = {"id": currentProductId};
    var option = {
      "upsert": false,
      "lean": true,
      "returnDocument":'after'
    }

    var addColToProductModel = async function (colName, updateValue) {
      await ProductModel.findOneAndUpdate(conditionId, updateValue, option)
      .exec((err, updated) => {

        if (err) { console.log(`error in tranform ${colName}:`, err); }
        console.log(`updated doc with  ${colName}:`, updated)
      })
    }

    var featureObjIds = FeatureModel.distinct('_id', conditionProductId);
    var relatedProductIds = RelatedModel.distinct('related_product_id', conditionRelated_product_id);
    var styleObjIds = StyleModel.distinct('_id', conditionStyleId);
    var updatesCollections = [featureObjIds, relatedProductIds, styleObjIds]

    await Promise.all(updatesCollections)
      .then(async (results) => {
        // Add col "features" to "Product"
        featureObjIds = results[0];
        var column = "features";
        var update =  {[column] : featureObjIds};
        var addFeature = addColToProductModel(column, update);

        // Add col "related" to "Product" tables
        relatedProductIds = results[1];
        column = "relatedProducts";
        update =  {[column] : relatedProductIds}
        var addRelated = addColToProductModel(column, update);

        // Add col "styles" to "Product" tables
        styleObjIds = results[2];
        column = "styles";
        update =  {[column] : styleObjIds}
        var addStyle = addColToProductModel(column, update);

        return Promise.all([addFeature, addRelated, addStyle])
      })
      .then(() => {
        console.log('i 1000011?:', i);
        if (i === products.length - 1) {           // adjust this to none later when trying to tranform all
          console.timeEnd('test');
          process.exit();
        }
      })
      .catch((err) => {
        console.log('error while tranforming product table:', err);
      })



  }
}

var tranformStyles = async function () {

  // Add col "skus" to "styles" tables ==> skus: { sku: {quantity: "", size: ""}, sku: {quantity: "", size: ""}}

  // Add col "photos" to "styles" tables ==> photos: [photoObjId, photoObjId, …]
}

console.time('test');
tranformProducts();

// tranformStyles();







