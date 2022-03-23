var ProductModel = require('../database/dbSchema.js');
var mongoose = require('mongoose');

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

describe('Database: products', () => {
  it('product id should start with first product number 1 name Camo', async () => {
    var product = await ProductModel.find({id: '1'}).lean()
    expect(product[0].name).toEqual('Camo Onesie');
    expect(product[0].id).toEqual(1);
  })

  it('product id of the 7th document must be number 7 name Blues', async () => {
    var product = await ProductModel.findOne({id: 7}).lean()
    expect(product.name).toEqual('Blues Suede Shoes');
    expect(product.id).toEqual(7);
  })

  it('product id of the 7th document must be number 8 name YEasy', async () => {
    var product = await ProductModel.findOne({id: 8}).lean()
    expect(product.name).toEqual('YEasy 350');
    expect(product.id).toEqual(8);
  })

  it('product id of the 7th document must be number 9 name Blues', async () => {
    var product = await ProductModel.findOne({id: 9}).lean()
    expect(product.name).toEqual('Summer Shoes');
    expect(product.id).toEqual(9);
  })

  it('should have 1000011 rows (header included)', (done) => {
    ProductModel.count({}, (err, count) => {
      expect(count).toEqual(1000011);
      done();
    })
  })
  afterAll(()=>{ mongoose.disconnect()});
})

