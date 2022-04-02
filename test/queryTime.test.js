// THIS TEST MUST RUN SEPERATELY FROM OTHER TEST
var mongoose = require('../database/dbConnection.js');
var start, end;
var {performance} = require('perf_hooks');

var ProductModel = require('../database/dbSchema.js').productModel;

describe('Query execution time', () => {
  describe('First product query time', () => {
    it(`should not take more than 50s`, async () => {
      start = performance.now();
      await ProductModel.findOne({"id": 1})
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
        .then((docs) => {
          // console.log('result first', docs);
          if (docs.name === 'Camo Onesie') {
            end = performance.now();
            console.log('end - start: first', end - start);
            expect(end - start).toBeLessThan(50);  // < 50ms
          }
        })
    });
  })


  describe('Last product query time', () => {
    it(`should not take more than 50s`, async () => {
      start = performance.now();
      await ProductModel.findOne({"id": 1000011})
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
        .then((docs) => {
          // console.log('result first', docs);
          if (docs.name === 'Evangeline Shoes') {
            end = performance.now();
            console.log('end - start: last', end - start);
            expect(end - start).toBeLessThan(50);  // < 50ms
          }
        })
    });
  })

  describe('Middle product query time', () => {
    it(`should not take more than 50s`, async () => {
      start = performance.now();
      await ProductModel.findOne({"id": 500000})
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
        .then((docs) => {
          // console.log('result first', docs);
          if (docs.name === 'Edythe 0 Trousers') {
            end = performance.now();
            console.log('end - start: middle', end - start);
            expect(end - start).toBeLessThan(50);  // < 50ms
          }
        })
    });
  })
  afterAll(()=>{
    mongoose.disconnect();
  });
})