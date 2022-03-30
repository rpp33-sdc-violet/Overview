var StyleModel = require('./dbSchema.js').styleModel;
var PhotoModel = require('./dbSchema.js').photoModel;
var SkuModel = require('./dbSchema.js').skuModel;

// eslint-disable-next-line no-unused-vars
var mongoose = require('../database/dbConnection.js');
var Promise = require("bluebird");

// Add col "skus" to "styles" tables ==> skus: { sku: {quantity: "", size: ""}, sku: {quantity: "", size: ""}}
// Add col "photos" to "styles" tables ==> photos: [photoObjId, photoObjId, …]

var tranformStyles = async function () {
  // iterate over all styles table id
  var styles = await StyleModel.find({}).lean();
  // console.log('styles:', styles);

  for (var i = 1; i < styles.length; i++) {
    console.log('i 1958102?:', i);
    console.log('styles[i]:', styles[i]);
    var currentStyleId = styles[i].id;
    var conditionStyleId = { "styleId": currentStyleId };
    var conditionId = { "id": currentStyleId };
    var option = {
      "upsert": false,
      "lean": true,
      "returnDocument":'after'
    };

    var addColToStyleModel = async function (colName, updateValue) {
      await StyleModel.findOneAndUpdate(conditionId, updateValue, option)
        .exec((err, updated) => {
          if (err) { console.log(`error in tranform ${colName}:`, err) }
          console.log(`updated doc with  ${colName}:`, updated);
        })
    }

    var photoObjIds = PhotoModel.distinct('_id', conditionStyleId);
    var skuObjIds = SkuModel.distinct('_id', conditionStyleId);
    var updatesCollections = [photoObjIds, skuObjIds];

    await Promise.all(updatesCollections)
      .then(async (results) => {
        // Add col "photos" to "styles"
        photoObjIds = results[0];
        var column = "photos";
        var update =  {[column] : photoObjIds};
        var addPhoto = addColToStyleModel(column, update);

        // Add col "sku" to "styles" tables
        skuObjIds = results[1];
        column = "skus";
        update =  {[column] : skuObjIds}
        var addSku = addColToStyleModel(column, update);

        return Promise.all([addPhoto, addSku])
      })
      .then(() => {
        console.log('i 1958102?:', i);
        // eslint-disable-next-line no-undef
        process.exit();
        // if (i === products.length - 1) {           // adjust this to none later when trying to tranform all
        //   console.timeEnd('test');
        //   process.exit();
        // }
      })
      .catch((err) => {
        console.log('error while tranforming style table:', err);
      })


      break;
  }
}

console.time('test');
tranformStyles();