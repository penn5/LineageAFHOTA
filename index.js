var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');
var assert = require('assert');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({'extended': true}));

function getFLID(device) {
  var lookup = {'lld': '266525', 'leland': '266525', 'hi6250': '266525'};
  return lookup[device];
}
function apiRoute(req, res) {
  request('https://httpbin.org/get', {json: false}, function (error, response, body) {
    console.log(error);
    console.log(body);
    assert.equal(body.STATUS, 1);
    assert.equal(body.CODE, 200);
    var result = [];
    body.DATA.files.forEach(function(file) {
      result.push({'incremental': file.md5hash.slice(0,10), 'api_level': 0, 'url': file.url, 'timestamp': file.upload_date, 'filename': file.name, 'channel': new RegExp('-').split(file.name)[3]});
    });
    var respons = {'id': null, 'result': result, 'error': null};
    res.send(respons);
  });
}


app.get('/api/v1/:device', apiRoute);
app.listen(8080);
