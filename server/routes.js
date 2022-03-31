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

routers.get('/products/:product_id/styles', (req, res) => {

  var product_id = req.params.product_id;
  var fields = '-_id -features -relatedProducts'
  console.log('product_id', product_id);
  ProductModel.findOne({"id": product_id}, fields)
    .populate({
      path: 'styles',
      select: '-_id -productId',
      populate: { path: 'photos' ,select: 'url thumbnail_url -_id'}
    })
    .populate({
      path: 'styles',
      select: '-_id -productId',
      populate: { path: 'skus', select: '-styleId -_id' }
    })
    .lean()
    .exec( function (err, docs) {
      if (err) { console.log('err retrieving data for /products/:product_id', err); }
      var styles = docs.styles.map((style) => {
        var defaultS = style.default_style === 0 ? false: true;
        var skuObjs = style.skus.reduce((previousValue, currentValue) => {
          var skuId = currentValue.id;
          var skuSize = currentValue.size;
          var skuQuantity = currentValue.quantity;
          previousValue[skuId] = {
            size: skuSize,
            quantity: Number(skuQuantity)
          }
          return previousValue
        }, {})
        return {
          "style_id": style.id,
          "name": style.name,
          "original_price": style.original_price.toString(),
          "sale_price": style.sale_price.toString(),
          "default?": defaultS,
          "photos": style.photos,
          "skus": skuObjs
        }
      });

      var result = {
        product_id: docs.id.toString(),
        results: styles
      }
      res.send(result);
    });

});

routers.get('/products/:product_id/related', (req, res) => {

  var product_id = req.params.product_id;
  var fields = 'relatedProducts -_id'

  ProductModel.findOne({"id": product_id}, fields).lean().exec( function (err, docs) {
    if (err) { console.log('err retrieving data for /products/:product_id/related', err); }
    res.send(docs.relatedProducts);
  });

});

module.exports = routers;

