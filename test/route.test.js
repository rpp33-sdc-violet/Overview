var request = require('supertest');
var app = require('../server/index.js');
var mongoose = require('../database/dbConnection.js');

describe('API Routes', function() {
  describe('GET /products', function() {
    it('responds with 5 products if no params', function() {
      return request(app).get('/products')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(5);
        })
    });

    it('responds with 6 products if count params equal 6', function() {
      return request(app).get('/products/?page=1&count=6')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(6);
        })
    });

    it('it should have id, name, slogan, description, category, default_price', function() {
      var expected =  [
        {
          "id":7,
          "name":"Blues Suede Shoes",
          "slogan":"2019 Stanley Cup Limited Edition",
          "description":"Touch down in the land of the Delta Blues in the middle of the pouring rain",
          "category":"Dress Shoes",
          "default_price":120
        },
        {
          "id":9,
          "name":"Summer Shoes",
          "slogan":"A risky call in the spring or fall",
          "description":"Low-top panelled buffed leather and mesh sneakers. Sizing embroidered in black at round toe. Tonal lace-up closure. Pull-loop and rubberized style name at padded tongue. Padded collar. Pull-loop at heel collar. Logo embroidered in black at outer side. Tonal treaded rubber sole. Tonal stitching.",
          "category":"Kicks",
          "default_price":59
        }
      ]
      return request(app).get('/products/?page=1&count=2')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(expected);
        })
    });
  });

  describe('GET /products/:product_id', function() {
    it('it should have id, name, slogan, description, category, default_price, and features AND features should be an array of objects with key feature and value', () => {

      var expected = {
        "id":7,
        "name":"Blues Suede Shoes",
        "slogan":"2019 Stanley Cup Limited Edition",
        "description":"Touch down in the land of the Delta Blues in the middle of the pouring rain",
        "category":"Dress Shoes",
        "default_price":120,
        "features":[
          {"feature":"Sole","value":"Rubber"},
          {"feature":"Material","value":"FullControlSkin"},
          {"feature":"Stitching","value":"Double Stitch"}
        ]
      }

      return request(app).get('/products/7')
        .expect(200)
        .then(response => {
          console.log('res', response.body);
          expect(response.body).toEqual(expected);
        })

    })
  });

  describe('GET /products/:product_id/styles', function() {
  //   it('should return object', () => {

  //   })
  //   it('should have key product_id and results', () => {

  //   })
  //   it('results value should be an array of objects', () => {

  //   })
  //   it('objects in resutls array must have key style_id, name, original_price, sale_price, default?, photos, skus', () => {

  //   })
  //   it('value of photos must be array', () => {

  //   })
  //   it('value of photos must be array of objects', () => {

  //   })
  //   it('photos object must have key thumbnail_url and url', () => {

  //   })
  //   it('skus value must be an object', () => {

  //   })
  //   it('each value in the skus must have a key of sku id and value of object with key quantity and size', () => {

  //   })
  });

  describe('GET /products/:product_id/related', function() {
  //   it('this should return an array of all related product id', () => {

  //   })
  });

  afterAll( async ()=> {
    await mongoose.disconnect();
  });
});
