var ProductModel = require('../database/dbSchema.js').productModel;
var FeatureModel = require('../database/dbSchema.js').featureModel;
var mongoose = require('../database/dbConnection.js');

var { ObjectId } = mongoose.Types;
/* How product document looks like: when retrive with find:
[
  {
    _id: ObjectId("623adf4d31198df18185e284"),
    id: 9,
    name: 'Summer Shoes',
    slogan: 'A risky call in the spring or fall',
    description: 'Low-top panelled buffed leather and mesh sneakers. Sizing embroidered in black at round toe. Tonal lace-up closure. Pull-loop and rubberized style name at padded tongue. Padded collar. Pull-loop at heel collar. Logo embroidered in black at outer side. Tonal treaded rubber sole. Tonal stitching.',
    category: 'Kicks',
    default_price: 59
  }
]
retrive with findOne:
  {
    _id: ObjectId("623adf4d31198df18185e284"),
    id: 9,
    name: 'Summer Shoes',
    slogan: 'A risky call in the spring or fall',
    description: 'Low-top panelled buffed leather and mesh sneakers. Sizing embroidered in black at round toe. Tonal lace-up closure. Pull-loop and rubberized style name at padded tongue. Padded collar. Pull-loop at heel collar. Logo embroidered in black at outer side. Tonal treaded rubber sole. Tonal stitching.',
    category: 'Kicks',
    default_price: 59
  }
*/
describe('load process', () => {
  describe('Database: products', () => {
    it('product id should start with first product number 1 name Camo', async () => {
      var product = await ProductModel.find({id: '1'}).lean()
      expect(product[0].name).toEqual('Camo Onesie');
      expect(product[0].id).toEqual(1);
    })

    it('product id of the 7th document must be number 7 name Blues', async () => {

      var product = await ProductModel.findOne({id: 7}).populate('features','feature value -_id').lean()
      console.log('product', product);
      var features = [ {
          feature: 'Sole',
          value: 'Rubber'
        },
        {
          feature: 'Material',
          value: 'FullControlSkin'
        },
        {
          feature: 'Stitching',
          value: 'Double Stitch'
      }]
      expect(product.name).toEqual('Blues Suede Shoes');
      expect(product.id).toEqual(7);
      expect(product.features).toEqual(features);
    })

    it('product id of the 8th document must be number 8 name YEasy', async () => {
      var product = await ProductModel.findOne({id: 8}).lean()
      expect(product.name).toEqual('YEasy 350');
      expect(product.id).toEqual(8);
    })

    it('product id of the 9th document must be number 9 name Blues, and able to get features out of the populate function', async () => {
      var product = await ProductModel.findOne({id: 9}).populate('features').lean()
      var features = [
        {
          _id: ObjectId("623ef7edc896a02970de1d19"),
          id: 24,
          product_id: 9,
          feature: 'Sole',
          value: 'Rubber'
        },
        {
          _id: ObjectId("623ef7edc896a02970de1d1e"),
          id: 25,
          product_id: 9,
          feature: 'Material',
          value: 'FullControlSkin'
        },
        {
          _id: ObjectId("623ef7edc896a02970de1d21"),
          id: 26,
          product_id: 9,
          feature: 'Mid-Sole',
          value: 'ControlSupport Arch Bridge'
        },
        {
          _id: ObjectId("623ef7edc896a02970de1d22"),
          id: 27,
          product_id: 9,
          feature: 'Stitching',
          value: 'Double Stitch'
        }
      ]
      expect(product.name).toEqual('Summer Shoes');
      expect(product.id).toEqual(9);
      expect(product.features).toEqual(features);
    })

    it('should have 1000011 rows (header included)', (done) => {
      ProductModel.count({}, (err, count) => {
        expect(count).toEqual(1000011);
        done();
      })
    })
  })

  describe('Database: features', () => {
    it('product id 9 should return 4 features', async () => {
      var features = await FeatureModel.find({product_id: '9'}).lean()
      expect(features[0].feature).toEqual('Sole');
      expect(features[0].value).toEqual('Rubber');
      expect(features[0].product_id).toEqual(9);
      expect(features[0].id).toEqual(24);
      expect(features[0]._id.toString()).toEqual("623ef7edc896a02970de1d19");
      expect(features.length).toEqual(4);
    })

    it('should have 2219279 rows (header included)', (done) => {
      FeatureModel.count({}, (err, count) => {
        expect(count).toEqual(2219279);
        done();
      })
    })
  })

  afterAll(()=>{
    mongoose.disconnect();
  });
});

