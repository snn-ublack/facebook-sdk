
const {Fbapi}  = require('./src/fb.js');
const test = require('ava');
const HttpsProxyAgent = require('https-proxy-agent');


test('simple', function() {
    var f = new Fbapi({"access_token": "xxxx"});
    f.fetch('https://somethingtome.com/me', params={"fields": "exmaple"});
});

test('post', function() {
    var f = new Fbapi({"access_token": "xxxx"});
    f.fetch('https://somethingtome.com/me', params={}, fetchOpts={"body": "exmaple"});
});

test('proxy', function() {
    var f = new Fbapi({"access_token": "xxxx"});
    f.fetch('https://somethingtome.com/me', params={}, fetchOpts={
        "body": "exmaple",
        "agent": new HttpsProxyAgent('http://46.250.171.31:8080')
    });
});
