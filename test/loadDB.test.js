var mongoose = require('../database/dbConnection.js');
var { ObjectId } = mongoose.Types;

var ProductModel = require('../database/dbSchema.js').productModel;
var FeatureModel = require('../database/dbSchema.js').featureModel;
var RelatedModel = require('../database/dbSchema.js').relatedModel;
var StyleModel = require('../database/dbSchema.js').styleModel;
var PhotoModel = require('../database/dbSchema.js').photoModel;
var SkuModel = require('../database/dbSchema.js').skuModel;


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

  describe('Database: related', () => {
    it('product id 1 should return 4 related product', async () => {
      var relatedProducts = await RelatedModel.find({current_product_id: '1'}).lean();
      var expected = [
        {
          _id: ObjectId("6240169b90cef9bca0e83ae8"),
          id: 1,
          current_product_id: 1,
          related_product_id: 2
        },
        {
          _id: ObjectId("6240169b90cef9bca0e83ae9"),
          id: 2,
          current_product_id: 1,
          related_product_id: 3
        },
        {
          _id: ObjectId("6240169b90cef9bca0e83aea"),
          id: 3,
          current_product_id: 1,
          related_product_id: 8
        },
        {
          _id: ObjectId("6240169b90cef9bca0e83aeb"),
          id: 4,
          current_product_id: 1,
          related_product_id: 7
        }
      ]
      expect(relatedProducts).toEqual(expected);
      expect(relatedProducts.length).toEqual(4);
    })

    it('should have 4508263 rows (header included)', (done) => {
      RelatedModel.count({}, (err, count) => {
        expect(count).toEqual(4508263);
        done();
      })
    })
  })

  describe('Database: features', () => {
    it('product id 9 should return 4 features', async () => {
      var features = await FeatureModel.find({product_id: '9'}).lean()
      var expected = [
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
      expect(features[0].feature).toEqual('Sole');
      expect(features[0].value).toEqual('Rubber');
      expect(features[0].product_id).toEqual(9);
      expect(features[0].id).toEqual(24);
      expect(features[0]._id.toString()).toEqual("623ef7edc896a02970de1d19");
      expect(features).toEqual(expected);
      expect(features.length).toEqual(4);
    })

    it('should have 2219279 rows (header included)', (done) => {
      FeatureModel.count({}, (err, count) => {
        expect(count).toEqual(2219279);
        done();
      })
    })
  })

  describe('Database: styles', () => {
    it('product id 1 should return 6 styles', async () => {
      var styles = await StyleModel.find({productId: '1'}).lean();
      var expected = [
        {
          _id: ObjectId("624020e46efd8b76d928711e"),
          id: 3,
          productId: 1,
          name: 'Ocean Blue & Grey',
          sale_price: 100,
          original_price: 140,
          default_style: 0
        },
        {
          _id: ObjectId("624020e46efd8b76d928711f"),
          id: 5,
          productId: 1,
          name: 'Sky Blue & White',
          sale_price: 100,
          original_price: 140,
          default_style: 0
        },
        {
          _id: ObjectId("624020e46efd8b76d9287120"),
          id: 6,
          productId: 1,
          name: 'Dark Grey & Black',
          sale_price: 'null',
          original_price: 170,
          default_style: 0
        },
        {
          _id: ObjectId("624020e46efd8b76d9287124"),
          id: 4,
          productId: 1,
          name: 'Digital Red & Black',
          sale_price: 'null',
          original_price: 140,
          default_style: 0
        },
        {
          _id: ObjectId("624020e46efd8b76d9287125"),
          id: 2,
          productId: 1,
          name: 'Desert Brown & Tan',
          sale_price: 'null',
          original_price: 140,
          default_style: 0
        },
        {
          _id: ObjectId("624020e46efd8b76d9287126"),
          id: 1,
          productId: 1,
          name: 'Forest Green & Black',
          sale_price: 'null',
          original_price: 140,
          default_style: 1
        }
      ]
      expect(styles).toEqual(expected);
      expect(styles.length).toEqual(6);
    })
    it('product id 9 should return 1 styles', async () => {
      var styles = await StyleModel.find({productId: '9'}).lean();
      var expected = [
        {
          _id: ObjectId("624020e46efd8b76d9287154"),
          id: 46,
          productId: 9,
          name: 'White',
          sale_price: 'null',
          original_price: 59,
          default_style: 0
        }
      ]
      expect(styles).toEqual(expected);
      expect(styles.length).toEqual(1);
    })
    it('should have 1958102 rows (header included)', (done) => {
      StyleModel.count({}, (err, count) => {
        expect(count).toEqual(1958102);
        done();
      })
    })
  })

  describe('Database: photos', () => {
    it('style id 1 should return 6 photos', async () => {
      var photos = await PhotoModel.find({styleId: '1'}).lean();
      var expected = [
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6efa"),
          id: 3,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1549831243-a69a0b3d39e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2775&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1549831243-a69a0b3d39e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'
        },
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6f04"),
          id: 2,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'
        },
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6f05"),
          id: 5,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1556648202-80e751c133da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1556648202-80e751c133da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'
        },
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6f06"),
          id: 1,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'
        },
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6f07"),
          id: 4,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1527522883525-97119bfce82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1527522883525-97119bfce82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          _id: ObjectId("62402b1bf2a16a3e95ed6f08"),
          id: 6,
          styleId: 1,
          url: 'https://images.unsplash.com/photo-1532543491484-63e29b3c1f5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1532543491484-63e29b3c1f5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'
        }
      ]
      expect(photos).toEqual(expected);
      expect(photos.length).toEqual(6);
    })

    it('should have 5655656 rows (header included)', (done) => {
      PhotoModel.count({}, (err, count) => {
        expect(count).toEqual(5655656);
        done();
      })
    })
  })

  describe('Database: skus', () => {
    it('product id 1 should return 6 skus', async () => {
      var skus = await SkuModel.find({styleId: '1'}).lean();
      var expected = [
        {
          _id: ObjectId("62401dd18291848a7a1a083d"),
          id: 4,
          styleId: 1,
          size: 'L',
          quantity: 10
        },
        {
          _id: ObjectId("62401dd18291848a7a1a083e"),
          id: 6,
          styleId: 1,
          size: 'XL',
          quantity: 4
        },
        {
          _id: ObjectId("62401dd18291848a7a1a0844"),
          id: 1,
          styleId: 1,
          size: 'XS',
          quantity: 8
        },
        {
          _id: ObjectId("62401dd18291848a7a1a084f"),
          id: 2,
          styleId: 1,
          size: 'S',
          quantity: 16
        },
        {
          _id: ObjectId("62401dd18291848a7a1a0851"),
          id: 3,
          styleId: 1,
          size: 'M',
          quantity: 17
        },
        {
          _id: ObjectId("62401dd18291848a7a1a0853"),
          id: 5,
          styleId: 1,
          size: 'XL',
          quantity: 15
        }
      ]
      expect(skus).toEqual(expected);
      expect(skus.length).toEqual(6);
    })

    it('product id 9 should return 0 skus', async () => {
      var skus = await SkuModel.find({styleId: '9'}).lean();
      var expected = []
      expect(skus).toEqual(expected);
      expect(skus.length).toEqual(0);
    })

    it('should have 11323917 rows (header included)', (done) => {
      SkuModel.count({}, (err, count) => {
        expect(count).toEqual(11323917);
        done();
      })
    })
  })

  afterAll(()=>{
    mongoose.disconnect();
  });
});

