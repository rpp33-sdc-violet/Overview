var ProductModel = require('./dbSchema.js').productModel;
var FeatureModel = require('./dbSchema.js').featureModel;

var addObjectIdCol = function (colName) {
  // helper function if want to refactor later
}

var tranformProductToHaveFeatureCol = async function () {
  // iterate over all products table id
  var products = await ProductModel.find({}).lean();
  // console.log('products:', products);

  for (var i = 1; i < products.length; i++) {
    // search feature with that product id
    var condition1 = {"product_id": products[i].id};
    var condition2 = {"id": products[i].id};
    var option = {
      "upsert": false,
      "lean": true,
      "returnDocument":'after'
    }

    FeatureModel.distinct('_id', condition1)
      .exec( async (err, features) => {
        if (err) { console.log('error in tranform product:', err); }
        var update =  {"features": features}
        ProductModel.findOneAndUpdate(condition2, update, option)
          .exec((err, updated) => {
            if (err) { console.log('error in tranform product:', err); }
            console.log('updated doc', updated)
          })
      })


    break;
      // retreive feature object id
      // var objectId = adventure._id;
      // // store this objectId in feature column of product
      // products.update({ features:  })
  }
}

tranformProductToHaveFeatureCol();







