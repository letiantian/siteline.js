var config;

config = {
    dbpath: __dirname + '/data/siteline.db',
    crawler: {
        compact: true,
        rmDuplicate: true,
        windowSize: 3,
        userAgents: ['Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
                     'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'],
        ipPool:[],
        titleMinLength: 6
    },
    server: {
        host: '127.0.0.1',
        port: '4567'
    }
}

module.exports = config;