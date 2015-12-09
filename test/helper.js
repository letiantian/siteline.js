var assert = require('assert');

var helper = require('../util/helper');

describe('util/helper', function() {
    describe('#obj2json( obj )', function () {
        it('the string of array should be equal with the given string', function () {
            assert.equal('[]', helper.obj2json([]));
            assert.equal('[1,2]', helper.obj2json([1,2]));
        });

        it('the string of obj should be equal with the given string', function () {
            assert.equal('{}', helper.obj2json({}));
            assert.equal('{"age":20}', helper.obj2json({age:20}));
        });
    });

    describe('#json2obj( string )', function () {
        it('the converted array should be equal with the given string', function () {
            assert.deepEqual([], helper.json2obj('[]'));
            assert.deepEqual([1,2], helper.json2obj('[1,2]'));
        });

        it('the converted obj should be equal with the given string', function () {
            assert.deepEqual({}, helper.json2obj('{}'));
            assert.deepEqual({age:20}, helper.json2obj('{"age":20}'));
        });
    });

});