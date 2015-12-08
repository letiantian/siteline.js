var urllib      = require("url"),
    request     = require('request'),
    config      = require('../config'),
    cheerio     = require('cheerio'),
     _          = require('underscore');

/**
> var url = require("url");
undefined
> url.resolve('http://127.0.0.1/10', 'http://127.0.0.1');
'http://127.0.0.1/'
> url.resolve('http://127.0.0.1/10', 'http://127.0.0.2');
'http://127.0.0.2/'
> url.resolve('http://127.0.0.1/10', 'http://127.0.0.1/1/2/3');
'http://127.0.0.1/1/2/3'
> url.resolve('http://127.0.0.1/10', '1/2/3');
'http://127.0.0.1/1/2/3'
> url.resolve('http://127.0.0.1/10', '/1/2/3');
'http://127.0.0.1/1/2/3'
 */

function mergeUrl(from, to) {
    return urllib.resolve(from, to);
}


/**
> isUrl('asd')
false
> isUrl('http://')
true
> isUrl('https://123.com')
true
 */

function isUrl(s) {
    if (s.indexOf('http://') == 0) {
        return true;
    } else if (s.indexOf('https://') == 0) {
        return true;
    } else {
        return false;
    }
}

/**
> addSlash('http://127.0.0.1')
'http://127.0.0.1/'
> addSlash('http://127.0.0.1/')
'http://127.0.0.1/'
> addSlash('https://127.0.0.1/')
'https://127.0.0.1/'
> addSlash('https://127.0.0.1')
'https://127.0.0.1/'
> addSlash('https://127.0.0.1/123')
'https://127.0.0.1/123'
> addSlash('https://127.0.0.1/123/')
'https://127.0.0.1/123/'

 */

function addSlash(s) {
    tmp = s.replace('http://', '').replace('https://', '');
    if (tmp.indexOf('/') < 0) {
        return s+'/';
    } else {
        return s;
    }
}

function getUrls(s) {
    return new Promise(function(resolve, reject){
        userAgent = 'request';
        if (config.crawler.userAgents.length > 0) {
            position = _.random(0, config.crawler.userAgents.length);
            userAgent = config.crawler.userAgents[position];
        }
        request({url: s, headers: {'User-Agent': userAgent}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var urls = [];
                links = $('a');
                $(links).each(function(i, link){
                    url = $(link).attr('href');
                    title = $(link).text();
                    if (url && title)
                    urls.push({url: mergeUrl(s, url.trim()), title: title.trim()});
                });
                resolve(urls);
            }
            reject(Error(error));
        });
    });
}

/**
urlsObj = [{url, title},{url, title}, ...]
result  = [{}, {}]
*/
function compactUrls(urlsObj) {
    var result   = [];
    var urlsMap  = {};
    var urlsList = [];
    for (var idx = 0; idx < urlsObj.length; ++idx) {
        url = urlsObj[idx].url;
        title = urlsObj[idx].title;
        if (typeof url !== 'undefined' && typeof title !== 'undefined' && isUrl(url)) {
            if (title.length > config.crawler.titleMinLength ) {
                urlsList.push(url);
                urlsMap[url] = title;
            }
        }
    }

    urlsList = _.uniq(urlsList);
    _.each(urlsList, function(url) {
        result.push({url: url, title: urlsMap[url]});
    });
    return result;
}

/**
sourceUrlsObj = [{url, title},{url, title}, ...]
blackList     = [ [{url, title},{url, title}],[{url, title},{url, title}] ]，最低得是个[]
*/
function rmDuplicate(sourceUrlsObj, blackList) {
    var sourceUrlsList = [],
        sourceUrlsMap  = {},
        blackUrlsList  = [],
        result         = [];
    
    _.each(sourceUrlsObj, function(item) {
        sourceUrlsList.push(item.url);
        sourceUrlsMap[item.url] = item.title;
    });

    if (_.isArray(blackList)) {
        _.each(blackList, function(blackUrlsObj){
            if (_.isArray(blackUrlsObj)) {
                _.each(blackUrlsObj, function(item){
                    blackUrlsList.push(item.url);
                });
            }
        }); 
    }

    sourceUrlsList = _.uniq(sourceUrlsList);
    blackUrlsList  = _.uniq(blackUrlsList);
    whiteUrlsList  = _.difference(sourceUrlsList, blackUrlsList);

    _.each(whiteUrlsList, function(url) {
        result.push({url: url, title: sourceUrlsMap[url]});
    });
    
    return result;
}

/**
oldUrlsObj, newUrlsObj = [{url, title},{url, title}, ...]
*/

function mergeUrlsObj(oldUrlsObj, newUrlsObj) {
    var urlsList = [],
        urlsMap  = {},
        result   = [];
    _.each(oldUrlsObj, function(item) {
        urlsList.push(item.url);
        urlsMap[item.url] = item.title;
    });
    _.each(newUrlsObj, function(item) {
        urlsList.push(item.url);
        urlsMap[item.url] = item.title;
    });
    urlsList = _.uniq(urlsList);

    _.each(urlsList, function(url) {
        result.push({url: url, title: urlsMap[url]});
    });
    return result;
}

exports.mergeUrl = mergeUrl;
exports.isUrl = isUrl;
exports.addSlash = addSlash;
exports.getUrls = getUrls;
exports.compactUrls = compactUrls;
exports.rmDuplicate = rmDuplicate;
exports.mergeUrlsObj = mergeUrlsObj;


// getUrls('http://www.ifeng.com');

// rmDuplicate([{url: 123, title:1234}, {url: 123, title:12345}, {url: 1, title: 12}],[])
// rmDuplicate([{url: 123, title:1234}, {url: 123, title:12345}, {url: 1, title: 12}], [[ { url: 1, title: 12 } ], [ { url: 1, title: 12 },  { url: 12, title: 12 } ]]);

// console.log( _.uniq([{url: 123, title:1234}, {url: 123, title:1234}]) );


// console.log( _.random(0, 1) );  // 0 or 1
// console.log( _.random(0, 1) );