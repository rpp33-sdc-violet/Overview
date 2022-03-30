var express = require('express');
var routers = express.Router();
var ProductModel = require('../database/dbSchema.js').productModel;

routers.get('/test', (req, res) => {
  ProductModel.find({id: 9}).populate('features', 'feature value -_id').lean().exec( function (err, docs) {
    if (err) { console.log('err retrieving data', err); }
    res.send({ data: docs });
  });
});

routers.get('/products', (req, res) => {

  var query = req.query;
  // var page = query.page? query.page: 1;
  var count = query.count? query.count: 5;
  var fields = '-features -_id -styles -relatedProducts'
  var options = {
    limit: count
  }

  ProductModel.find({}, fields, options).lean().exec( function (err, docs) {
    if (err) { console.log('err retrieving data for /products', err); }
    res.send(docs);
  });

});

routers.get('/products/:product_id', (req, res) => {

  var product_id = req.params.product_id;
  var fields = '-_id -styles -relatedProducts'
  console.log('product_id', product_id);
  ProductModel.findOne({"id": product_id}, fields).populate('features','feature value -_id').lean().exec( function (err, docs) {
    if (err) { console.log('err retrieving data for /products/:product_id', err); }
    res.send(docs);
  });

});

module.exports = routers;

