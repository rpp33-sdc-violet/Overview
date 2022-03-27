var ProductModel = require('./dbSchema.js').productModel;
var FeatureModel = require('./dbSchema.js').featureModel;

var addObjectIdCol = function (colName) {
  // helper function if want to refactor later
}

var tranformProducts = async function () {
  // iterate over all products table id
  var products = await ProductModel.find({}).lean();
  // console.log('products:', products);

  for (var i = 1; i < products.length; i++) {
    // search feature with that product id
    var conditionProductId = {"product_id": products[i].id};
    var conditionId = {"id": products[i].id};
    var option = {
      "upsert": false,
      "lean": true,
      "returnDocument":'after'
    }

    // Add col "features" to "Product" tables ==> features: [featuresObjIds, featuresObjIds.., …]
    FeatureModel.distinct('_id', conditionProductId)
      .exec( async (err, featuresObjIds) => {
        if (err) { console.log('error in tranform product:', err); }

        var update =  {"features": featuresObjIds}
        
        ProductModel.findOneAndUpdate(conditionId, update, option)
          .exec((err, updated) => {

            if (err) { console.log('error in tranform product:', err); }
            console.log('updated doc', updated)
          })
      })

    // Add col "related" to "Product" tables ==> related: [productId, ….., …]

    // Add col "styles" to "Product" tables ==> styles: [styleObjId1, styleObjId1, ….]

    break;
  }
}

var tranformStyles = async function () {

  // Add col "skus" to "styles" tables ==> skus: { sku: {quantity: "", size: ""}, sku: {quantity: "", size: ""}}

  // Add col "photos" to "styles" tables ==> photos: [photoObjId, photoObjId, …]
}

tranformProducts();
tranformStyles();







