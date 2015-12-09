var assert = require('assert');

var dateUtil = require('../util/date');

describe('util/date', function() {
    describe('#today()', function () {
        it('should be the date of today', function () {
            today = dateUtil.today();
            assert.equal(new Date().getYear()+1900, today.year);
            assert.equal(new Date().getMonth()+1, today.month);
            assert.equal(new Date().getDate(), today.day);
        });
    });

    describe('#prevDay()', function () {
        it('should be the date of before the specified date', function () {

            assert.deepEqual({ year: 2015, month: 12, day: 9 }, dateUtil.prevDay(2015, 12, 10, 1));
            assert.deepEqual({ year: 2015, month: 11, day: 30 }, dateUtil.prevDay(2015, 12, 10, 10));

        });
    });


    describe('#prevDays()', function () {
        it('should be the dates of before the specified date', function () {
            assert.deepEqual([{ year: 2015, month: 12, day: 9 }], dateUtil.prevDays(2015, 12, 10, 1))
            assert.deepEqual([{ year: 2015, month: 12, day: 9 }, { year: 2015, month: 12, day: 8 }], dateUtil.prevDays(2015, 12, 10, 2))
        });
    });

});