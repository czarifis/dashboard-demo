var express = require('express')
var app = express()
var path = require('path')


app.use('/vanilla', express.static('vanilla'))
app.use('/angular', express.static('angular'))
app.use('/react', express.static('react'))
app.use('/test_users', express.static('test_users'))
app.use('/style.css', express.static('style/style.css'))

app.use('/dist', express.static('node_modules/highcharts-ng/dist/'));
app.use('/google-dist', express.static('node_modules/angular-google-maps/dist/'));
app.use('/lodash.js', express.static('node_modules/lodash/lodash.js'));
app.use('/angular-simple-logger.js', express.static('node_modules/angular-simple-logger/dist/angular-simple-logger.js'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/vanilla/index.html'))
})

app.get('/angular', function(req, res) {
  res.sendFile(path.join(__dirname, '/angular/index.html'))
})

app.listen(3000, function() {
  console.log('Started')
})

