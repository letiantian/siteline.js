var moment = require('moment');


function prevDay(year, month, day, interval) {
    interval = interval || 1;
    var dayWrapper = moment(new Date(year, month-1, day)).subtract(interval, 'days');
    return {year    : dayWrapper.year(),
            month   : dayWrapper.month(),
            day     : dayWrapper.date()};
}

function prevDays(year, month, day, window) {
    result = [];
    for (var interval=1; interval <= window; ++interval) {
        result.push(prevDay(year, month, day, interval));
    }
    return result;
}

function today() {
    var m = moment();
    return {year    : m.year(),
            month   : m.month(),
            day     : m.date()};
}

exports.prevDays = prevDays;
exports.today    = today;

// console.log(moment().format());
// console.log(prevDay(2015, 12, 13));
// console.log(prevDays(2015, 12, 13, 3));

/**
2015-12-07T12:34:23+08:00
{ year: 2015, month: 11, day: 12 }
[ { year: 2016, month: 2, day: 21 },
  { year: 2016, month: 2, day: 20 },
  { year: 2016, month: 2, day: 19 } ]
 */