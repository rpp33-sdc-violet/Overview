var mongoose = require('../database/dbConnection.js');
// var { ObjectId } = mongoose.Types;

var ProductModel = require('../database/dbSchema.js').productModel;
// var FeatureModel = require('../database/dbSchema.js').featureModel;
// var RelatedModel = require('../database/dbSchema.js').relatedModel;
// var StyleModel = require('../database/dbSchema.js').styleModel;
// var PhotoModel = require('../database/dbSchema.js').photoModel;
// var SkuModel = require('../database/dbSchema.js').skuModel;


describe('call to product table', () => {
 describe('product table', () => {
  it('it should have all fields', async () => {
    var product1 = await ProductModel
      .findOne({id: 1}, '-_id')
      .populate('features','feature value -_id')
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

    console.log('product1', product1);
    expect(product1.id).toEqual(1);
    expect(product1.name).toEqual('Camo Onesie');
    expect(product1.slogan).toEqual('Blend in to your crowd');
    expect(product1.description).toEqual('The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.');
    expect(product1.category).toEqual('Jackets');
    expect(product1.default_price).toEqual(140);

    expect(Array.isArray(product1.features)).toEqual(true);
    expect(product1.features[0].feature).toEqual('Fabric');
    expect(product1.features[0].value).toEqual('Canvas');

    expect(Array.isArray(product1.relatedProducts)).toEqual(true);
    expect(product1.relatedProducts).toEqual([ 2, 3, 7, 8 ]);

    expect(Array.isArray(product1.styles)).toEqual(true);
    expect(product1.styles[0].id).toEqual(3);
    expect(product1.styles[0].name).toEqual('Ocean Blue & Grey');
    expect(product1.styles[0].original_price).toEqual(140);
    expect(product1.styles[0].sale_price).toEqual(100);
    expect(product1.styles[0].default_style).toEqual(0);

    expect(Array.isArray(product1.styles[0].photos)).toEqual(true);
    console.log('product1 photos', product1.styles[0].photos[0]);
    expect(typeof product1.styles[0].photos[0].url).toEqual('string');
    expect(typeof product1.styles[0].photos[0].thumbnail_url).toEqual('string');

    expect(Array.isArray(product1.styles[0].skus)).toEqual(true);  // currently the sku is array
    console.log('product1 skus', product1.styles[0].skus);
    expect(product1.styles[0].skus[0].quantity).toEqual(8);
    expect(product1.styles[0].skus[0].size).toEqual('XS');

    })
  })
  afterAll(()=>{
    mongoose.disconnect();
  });
});