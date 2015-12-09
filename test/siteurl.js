var assert = require('assert');

var urlUtil = require('../util/siteurl');

describe('util/siteurl', function() {

    describe("#isUrl( str )", function(){
        it("if a given str is a valid url", function(){
            assert.equal(true, urlUtil.isUrl('http://127.0.0.1'));
            assert.equal(true, urlUtil.isUrl('https://127.0.0.1'));
            assert.equal(false, urlUtil.isUrl('ftp://127.0.0.1'));
            assert.equal(false, urlUtil.isUrl('//127.0.0.1'));
            assert.equal(false, urlUtil.isUrl('127.0.0.1'));
        });
    });

    describe("#addSlash( url )", function(){
        it("add slah to the base url of a site", function() {
            assert.equal('http://127.0.0.1/', urlUtil.addSlash('http://127.0.0.1'));
            assert.equal('http://127.0.0.1/', urlUtil.addSlash('http://127.0.0.1/'));
            assert.equal('https://127.0.0.1/', urlUtil.addSlash('https://127.0.0.1'));
            assert.equal('https://127.0.0.1/', urlUtil.addSlash('https://127.0.0.1/'));
            assert.equal('https://127.0.0.1/123', urlUtil.addSlash('https://127.0.0.1/123'));
            assert.equal('https://127.0.0.1/123/', urlUtil.addSlash('https://127.0.0.1/123/'));
        });
    });

    describe('#mergeUrl( from, to )', function () {
        it('the merged url be equal with the given url', function () {
            assert.equal('http://127.0.0.1/1/2/3', urlUtil.mergeUrl('http://127.0.0.1/10', '1/2/3'));
            assert.equal('http://127.0.0.1/1/2/3', urlUtil.mergeUrl('http://127.0.0.1/10', '/1/2/3'));
            assert.equal('http://127.0.0.1/1/2/3', urlUtil.mergeUrl('http://127.0.0.1/10', 'http://127.0.0.1/1/2/3'));
            assert.equal('http://127.0.0.2/', urlUtil.mergeUrl('http://127.0.0.1/10', 'http://127.0.0.2'));
            assert.equal('http://127.0.0.1/', urlUtil.mergeUrl('http://127.0.0.1/10', 'http://127.0.0.1'));
        });

    });

    describe('#rmDuplicate( )', function(){
        it('the dumplicated url should be removed', function(){
            sourceUrlsObj = [{url: 123, title:1234}, {url: 123, title:12345}, {url: 1, title: 12}];
            blackList = [];
            expected = [ { url: 123, title: 12345 }, { url: 1, title: 12 } ];
            assert.deepEqual(urlUtil.rmDuplicate(sourceUrlsObj, blackList), expected);

            sourceUrlsObj = [{url: 123, title:1234}, {url: 123, title:12345}, {url: 1, title: 12}];
            blackList = [[ { url: 1, title: 12 } ], [ { url: 1, title: 12 },  { url: 12, title: 12 } ]];
            expected  = [{ url: 123, title: 12345 }];
            assert.deepEqual(urlUtil.rmDuplicate(sourceUrlsObj, blackList), expected);
        });
    });
});