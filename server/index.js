const express = require('express')
const app = express()
const port = 8080
const routes = require('./routes.js');
var ProductModel = require('../database/dbSchema.js');


app.get('/', (req, res) => {

  ProductModel.find({id: 9}).lean().exec( function (err, docs) {
    if (err) {
      console.log('err retrieving data', err);
    }
    console.log('output dataFromProductModel:', docs);
    res.send({ data: docs });
    res.end();
  }); //{ "id": 1 }




});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})