var port = 8080
var app = require('./index.js');

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})