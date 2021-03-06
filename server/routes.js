var express = require('express');
var routers = express.Router();
var ProductModel = require('../database/dbSchema.js').productModel;
const path = require('path');
console.log('loader token', process.env.LOADERIO_TOKEN)

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

  ProductModel.find({}, fields, options).lean().exec( async function (err, docs) {
    if (err) {
      await res.send([]);
    }
    if (!docs || docs === null) {
      await res.send([]);
    }
    await res.send(docs);
  });

});

routers.get('/products/:product_id', (req, res) => {

  var product_id = req.params.product_id;
  var fields = '-_id -styles -relatedProducts'
  console.log('product_id', product_id);
  ProductModel.findOne({"id": product_id}, fields).populate('features','feature value -_id').lean().exec( async function (err, docs) {
    if (err) {
      await res.send({});
    }
    if (!docs || docs === null) {
      await res.send({});
    }
    docs.default_price = docs.default_price.toString();
    await res.send(docs);
  });

});

routers.get('/products/:product_id/styles', (req, res) => {
  var product_id = req.params.product_id;
  var fields = '-_id -features -relatedProducts'
  var errorresult = {
    product_id: product_id,
    results: [],
    error: "",
    errorcode: ""
  }
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
    .exec( async function (err, docs) {
      if (err) {
        console.log('err retrieving data for /products/:product_id', err);
        errorresult.error = 'Cannot retrieve data from SDC database';
        errorresult.errorcode = err;
        await res.send(errorresult);
      }
      console.log('docs', docs);
      if (docs === null || !docs) {
        errorresult.error = 'no data in the database';
        await res.send(errorresult);
      }
      var styles = docs.styles.map((style) => {
        var defaultS = style.default_style === 0 ? false: true;
        var salePrice = style.sale_price === "null" ? null : style.sale_price.toString();
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
          "sale_price": salePrice,
          "default?": defaultS,
          "photos": style.photos,
          "skus": skuObjs
        }
      });

      var result = {
        product_id: docs.id.toString(),
        results: styles
      }
      await res.send(result);
    });

});

routers.get('/products/:product_id/related', (req, res) => {

  var product_id = req.params.product_id;
  var fields = 'relatedProducts -_id'

  ProductModel.findOne({"id": product_id}, fields).lean().exec( async function (err, docs) {
    if (err) {
      console.log('err retrieving data for /products/:product_id/related', err);
      await res.send([]);
    }
    if (!docs || docs === null) {
      await res.send([]);
    }
    await res.send(docs.relatedProducts);
  });

});

routers.get(`/loaderio-${process.env.LOADERIO_TOKEN}.txt`, (req, res) => {
  console.log('loader token2', process.env.LOADERIO_TOKEN)
  var option = { root: path.join(__dirname, '..') }
  res.sendFile(`loaderio-${process.env.LOADERIO_TOKEN}.txt`, option)
})

module.exports = routers;

