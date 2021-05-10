'use strict'
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
// const FormData = require('form-data');
const URL = require('url');
const QS = require('querystring');

fetch.Promise = Bluebird;

const log4js = require("log4js");
var logger = log4js.getLogger('fbapi');
logger.level = "debug";

class Fbapi{
    constructor (idConfig){
        this.headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        };
        this.options = {};
        this.idConfig = idConfig;
    }

	stringifyParams (params) {
		var data = {};

		// https://developers.facebook.com/bugs/1925316137705574/
		// fields=[] as json is not officialy supported, however the README has made people mistakenly do so
		if ( Array.isArray(params.fields) ) {
			log(`The fields param should be a comma separated list, not an array, try changing it to: ${JSON.stringify(params.fields)}.join(',')`);
		}

		for ( let key in params ) {
			let value = params[key];
			if ( value && typeof value !== 'string' ) {
				value = JSON.stringify(value);
			}
			if ( value !== undefined ) {
				data[key] = value;
			}
		}

		return QS.stringify(data);
	}

    fetch(path, params={}, fetchOpts={}) {
        params['access_token'] = params['access_token'] || this.idConfig['access_token'];
		let uri = path.startsWith("/") ? `https://graph.facebook.com/${path}` : path;
		let parsedUri = URL.parse(uri);
		parsedUri.search = this.stringifyParams(params);
		uri = URL.format(parsedUri);

        let _fetchOpts = {
            method: fetchOpts['body'] ? "POST" : 'GET',
            headers: Object.assign({}, this.headers, fetchOpts['headers']) || {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
            body: fetchOpts['body'] || null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
            redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
            signal: null,       // pass an instance of AbortSignal to optionally abort requests
            follow: 20,         // maximum redirect count. 0 to not follow redirect
            timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
            compress: true,     // support gzip/deflate content encoding. false to disable
            size: 0,            // maximum response body size in bytes. 0 to disable
            agent: fetchOpts['agent'] || this._agent || null         // http(s).Agent instance or function that returns an instance (see below)
        };

        logger.info("requesting", uri, _fetchOpts);
        return fetch(uri, _fetchOpts);
    }
}

module.exports = {
    "Fbapi": Fbapi,
}
