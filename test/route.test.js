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
          expect(response.body).toEqual(expected);
        })

    })
  });

  describe('GET /products/:product_id/styles', function() {
    var response;
    beforeAll(() => {
      response = request(app).get('/products/1/styles')
    });
    it('should return object', () => {
      return response
        .expect(200)
        .then(response => {
          expect(Array.isArray(response.body)).toEqual(false);
          expect(typeof response.body).toEqual('object');
        })
    })
    it('should have key product_id and results', () => {
      return response
        .then(response => {
          expect(response.body.product_id).toEqual("1");
        })
    })
    it('results value should be an array of objects', () => {
      return response
        .then(response => {
          expect(Array.isArray(response.body.results)).toEqual(true);
        })
    })
    it('objects in resutls array must have key style_id, name, original_price, sale_price, default?, photos, skus', () => {
      return response
        .then(response => {
          expect(response.body.results[0].style_id).toEqual(3);
          expect(response.body.results[0].name).toEqual("Ocean Blue & Grey");
          expect(response.body.results[0].original_price).toEqual("140");
          expect(response.body.results[0].sale_price).toEqual("100");
          expect(response.body.results[0]["default?"]).toEqual(false);
          expect(Array.isArray(response.body.results[0].photos)).toEqual(true);
          expect(Array.isArray(response.body.results[0].skus)).toEqual(false);
          expect(typeof response.body.results[0].skus).toEqual('object');
        })
    })
    it('value of photos must be array', () => {
      return response
        .then(response => {
          expect(Array.isArray(response.body.results[0].photos)).toEqual(true);
        })
    })
    it('photos object must have key thumbnail_url and url', () => {
      return response
        .then(response => {
          expect(response.body.results[0].photos[0].url).toEqual("https://images.unsplash.com/photo-1556304653-cba65c59b3c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2761&q=80");
          expect(response.body.results[0].photos[0].thumbnail_url).toEqual("https://images.unsplash.com/photo-1556304653-cba65c59b3c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80");
        })
    })
    it('skus value must be an object', () => {
      return response
        .then(response => {
          expect(Array.isArray(response.body.results[0].skus)).toEqual(false);
          expect(typeof response.body.results[0].skus).toEqual('object');
        })
    })
    it('each value in the skus id 13 must have a key of sku id and value of object with key quantity and size', () => {
      return response
        .then(response => {
          expect(response.body.results[0].skus["13"].quantity).toEqual(8);
          expect(response.body.results[0].skus["13"].size).toEqual("XS");
        })
    })
  });

  describe('GET /products/:product_id/related', function() {
    it('this should return an array of all related product id', () => {
      return request(app).get('/products/1/related')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([2,3,7,8]);
          expect(Array.isArray(response.body)).toEqual(true);
        })
    })
  });

  afterAll( async ()=> {
    await mongoose.disconnect();
  });
});
