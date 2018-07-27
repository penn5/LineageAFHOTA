var express = require('express');
var app = express();
var unirest = require('unirest');
var bodyParser = require('body-parser');
var assert = require('assert');
app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  });
);

function getFLID(device) {
  var lookup = {'lld', '266525', 'leland': '266525', 'hi6250': '266525'};
  return lookup[device];
function apiRoute(req, res) {
  unirest.get('https://androidfilehost.com/api/?action=folder&flid='+getFLID(req.params['device']).end(function (response) {
    console.log(response.body);
    assert.equal(response.body.STATUS, 1);
    assert.equal(response.body.CODE, 200);
    result = [];
    response.body.DATA.files.forEach(function(file) {
      result.push({'incremental': file.md5hash.slice(0,10), 'api_level': 0, 'url': file.url, 'timestamp': file.upload_date, 'filename': file.name, 'channel': new RegExp('-').split(file.name)[3]});
    });
    respons = {'id': null, 'result': result, 'error': null};
    res.send(respons)
  });
}


app.get('/api/v1/:device', apiRoute);
app.listen(80);
