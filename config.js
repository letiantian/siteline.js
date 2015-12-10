var config;

config = {
    dbpath: __dirname + '/data/siteline.db',
    crawler: {
        compact: true,
        rmDuplicate: true,
        windowSize: 3,
        userAgents: ['Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
                     'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'],
        ipPool:['112.125.198.111', '132.11.38.121', '98.54.235.23'],
        interval: 1*60*1000,       // ms
        titleMinLength: 10
    },
    server: {
        host: '127.0.0.1',
        port: '4567'
    }
}

module.exports = config;