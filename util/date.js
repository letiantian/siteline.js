var moment = require('moment');


function prevDay(year, month, day, interval) {
    interval = interval || 0;
    var dayWrapper = moment(new Date(year, month-1, day)).subtract(interval, 'days');
    return {year    : dayWrapper.year(),
            month   : dayWrapper.month()+1,
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
            month   : m.month()+1,
            day     : m.date()};
}

exports.prevDay  = prevDay;
exports.prevDays = prevDays;
exports.today    = today;