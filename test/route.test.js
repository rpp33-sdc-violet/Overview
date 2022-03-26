var request = require('supertest');
var app = require('../server/index.js');
var mongoose = require('../database/dbConnection.js');

describe('GET /products', function() {
  it('responds with json', async function() {
    request(app).get('/products')
      .expect(function(res) {
        res.body.length > 1;
      })
      .expect(200)
  });

  afterAll( async ()=> {
    await mongoose.disconnect();
  });
});

