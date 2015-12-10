if (process.env.NODE_ENV !== 'production'){
    require('longjohn');
}

var sqlite3 = require('sqlite3').verbose();
var co      = require('co');
var _       = require('underscore');

var config   = require('./config');
var dateUtil = require('./util/date');
var urlUtil  = require('./util/siteurl');
var dbUtil   = require('./util/db');
var helper   = require('./util/helper');

var db = new sqlite3.Database(config.dbpath);
var debug = console.log;

function *crawl() {
    debug('start crawl...');
    yield dbUtil.createTable(db);
    sites = yield dbUtil.selectSites(db);
    debug('sites: \n', sites);
    for (var siteiIdx=0; siteiIdx < sites.length; ++siteiIdx) {
        try {
            item = sites[siteiIdx];
            debug('get urls from: ', item.url);
            urls = yield urlUtil.getUrls(item.url);

            debug('compact');
            urls = urlUtil.compactUrls(urls);
            
            today = dateUtil.today();

            debug('get blackList');
            blackList = []
            prevDays = dateUtil.prevDays(today.year, today.month, today.day, config.crawler.windowSize);
            for (var idx=0; idx < prevDays.length; ++idx) {
                row = yield dbUtil.selectLine(db, item.id, prevDays[idx].year, prevDays[idx].month, prevDays[idx].day);
                if(row && row.content) {
                    blackList.push(helper.json2obj(row.content || []));
                }
            }
            debug('insert or update line');
            row = yield dbUtil.selectLine(db, item.id, today.year, today.month, today.day);
            if (row) {
                oldUrls = helper.json2obj(row.content || []);
                newUrls = urls;
                debug('merge with today\'s older content');
                finalUrls = urlUtil.mergeUrlsObj(oldUrls, newUrls);
                debug('rm dumplicate urls with past days');
                finalUrls = urlUtil.rmDuplicate(finalUrls, blackList);
                debug('update');
                yield dbUtil.updateLine(db, item.id, today.year, today.month, today.day, helper.obj2json(finalUrls));
            } else {
                debug('insert');
                yield dbUtil.insertLine(db, item.id, today.year, today.month, today.day, helper.obj2json(urls));
            }
        } catch(err) {
            console.error(err);
        }
    }
}


var crawlAllSites = co.wrap(crawl);

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  }
}

function main() {
    var program = require('commander');
    program
      .option('--add <url>', 'A url, should be used with --title')
      .option('--title <title>', 'The title of url')
      .option('--crawl', 'start crawler')  // true or false
      .option('--crawlforever', 'start crawler forever')
      .option('--server', 'start restful server')
      .option('--list', 'list all sites')
      .parse(process.argv);

    if (program.add && program.title) {
        
        var url   = program.add,
            title = program.title;

        if ( urlUtil.isUrl(url) ) {
            url = urlUtil.addSlash(url);
            co(function *(){
                yield dbUtil.createTable(db);
                yield dbUtil.insertSite(db, url, title);
                debug('add success');
            }).then(function(){}, function(err){
                console.error(err);
            });
        } else {
            console.error(url, ' is not a valid url');
        }

    } else if (program.crawl) {
        
        co(function *(){
            yield crawlAllSites();
        }).then(function(){ }, function(err){
            console.error(err);
        });;

    } else if (program.crawlforever) {

        co(function*(){
            _continue = true;
            process.on('SIGINT', function() {
                debug("Caught interrupt signal");
                _continue = false;
            });
            while(_continue) {
                debug('\n******************'+ new Date()+'****************\n');
                yield crawlAllSites();
                if (_continue) {
                    yield sleep(config.crawler.interval);
                }
            }

        });

    } else if (program.list) {

        co(function *(){
            yield dbUtil.createTable(db);
            var sites = yield dbUtil.selectSites(db);
            debug(sites);
        }).then(function(){}, function(err){
            console.error(err);
        });

    }
}


///////////////////test


co(function* () {

    // yield dbUtil.createTable(db);

    ////
    // yield insertSite("http://www.douban.com", "douban");
    // yield insertLine(1, 2015, 10, 3, '[]');

    ////
    // sites = yield selectSites();
    // debug(r);
    // r = yield selectLine(1, 2015, 10, 3);
    // debug(r);

    ////
    // sites = yield selectSites();
    // for (var idx=0; idx < sites.length; ++idx) {
    //     item = sites[idx];
    //     urls = yield urlUtil.getUrls(item.url);

    //     if (config.crawler.compact) {
    //         debug('compact');
    //         urls = urlUtil.compactUrls(urls);
    //     }
    //     debug(helper.obj2json(urls));
    //     yield insertLine(item.id, 2015, 12, 7, helper.obj2json(urls));
    // }

    // urls = yield urlUtil.getUrls('http://www.ifeng.com');
    // debug(urlUtil.compactUrls(urls));

});

///////////////////main

main();

