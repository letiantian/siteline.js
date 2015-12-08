if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

var sqlite3 = require('sqlite3').verbose();
var co      = require('co');
var _       = require('underscore');

var config   = require('./config');
var dateUtil = require('./util/date');
var urlUtil  = require('./util/siteurl');
var helper   = require('./util/helper');

var db = new sqlite3.Database(config.dbpath);


function createTable() {

    console.log(config.dbpath);

    db.serialize(function() {
        db.run(`                                                 
            CREATE TABLE IF NOT EXISTS sites (                                
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,  
                url TEXT NOT NULL,                              
                title TEXT NOT NULL                             
            );                                                  
        `);

        db.run(`
            CREATE UNIQUE INDEX IF NOT EXISTS uq_sites_url    
            on sites (url);                     
        `);

        db.run(`
            CREATE UNIQUE INDEX IF NOT EXISTS uq_sites_title  
            on sites (title);                   
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS lines (       
                site_id INTEGER NOT NULL, 
                year INTEGER NOT NULL,    
                month INTEGER NOT NULL,   
                day INTEGER NOT NULL,     
                content TEXT NOT NULL   
            );                            
        `);

        db.run(`
            CREATE UNIQUE INDEX uq_lines_date   
            on lines (site_id, year, month, day);        
        `);

    });

}


function insertSite(url, title) {
    return new Promise(function(resolve, reject) {
        sql = "INSERT INTO sites(url, title) VALUES (?,?)";
        db.run(sql, [url, title], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function insertLine(siteId, year, month, day, content) {
    return new Promise(function(resolve, reject) {
        sql = "INSERT INTO lines(site_id, year, month, day, content) VALUES (?,?,?,?,?)";
        db.run(sql, [siteId, year, month, day, content], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        // db.serialize(function() {
        //     var stmt = db.prepare("INSERT INTO lines(site_id, year, month, day, content) VALUES (?,?,?,?,?)");
        //     stmt.run(siteId, year, month, day, content);
        //     stmt.finalize();
        //     resolve();
        // });
    });
}

function updateLine(siteId, year, month, day, content) {
    return new Promise(function(resolve, reject) {
        sql = "UPDATE lines SET content=? WHERE site_id=? AND year=? AND month=? AND day=?";
        db.run(sql, [content, siteId, year, month, day], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        // db.serialize(function() {
        //     var stmt = db.prepare("UPDATE lines SET content=? WHERE site_id=? AND year=? AND month=? AND day=?");
        //     stmt.run(content, siteId, year, month, day);
        //     stmt.finalize();
        //     resolve();
        // });
    });
}


function selectSites() {
    return new Promise(function(resolve, reject){
        db.all("SELECT id, url, title FROM sites", function(err, rows) {
            if(err) {
                reject(err);
            }
            else {
                resolve(rows); 
            }
        });
    });
}

function selectLine(siteId, year, month, day) {
    return new Promise(function(resolve, reject){
        var sql = "SELECT site_id, year, month, day, content FROM lines WHERE site_id=? AND year=? AND month=? AND day=?";
        db.get(sql, [siteId, year, month, day], function(err, row) {
            if (err){
                reject(err);
            }
            else{
                resolve(row);   // 若没有数据，则为undefined
            }
        });
    });
}


function crawlAllSites() {
    return co(function *(){
        sites = yield selectSites();
        console.log('----sites----: \n', sites);
        for (var siteiIdx=0; siteiIdx < sites.length; ++siteiIdx) {
            try {
                item = sites[siteiIdx];
                console.log('get urls from: ', item.url);
                urls = yield urlUtil.getUrls(item.url);

                if (config.crawler.compact) {
                    console.log('compact');
                    urls = urlUtil.compactUrls(urls);
                }
                today = dateUtil.today();

                // get black list
                blackList = []
                prevDays = dateUtil.prevDays(today.year, today.month, today.day, config.crawler.windowSize);
                for (var idx=0; idx < prevDays.length; ++idx) {
                    row = yield selectLine(item.id, prevDays[idx].year, prevDays[idx].month, prevDays[idx].day);
                    if(row && row.content) {
                        blackList.push(helper.json2obj(row.content || []));
                    }
                }

                row = yield selectLine(item.id, today.year, today.month, today.day);
                if (row) {
                    oldUrls = helper.json2obj(row.content || []);
                    newUrls = urls;
                    finalUrls = urlUtil.mergeUrlsObj(oldUrls, newUrls);
                    finalUrls = urlUtil.rmDuplicate(finalUrls, blackList);
                    console.log('update');
                    yield updateLine(item.id, today.year, today.month, today.day, helper.obj2json(finalUrls));
                } else {
                    console.log('insert');
                    yield insertLine(item.id, today.year, today.month, today.day, helper.obj2json(urls));
                }
            } catch(err) {
                console.error(err);
            }
        }
    });
}


function main() {
    var program = require('commander');
    program
      .option('--add <url>', 'A url, should be used with --title')
      .option('--title <title>', 'The title of url')
      .option('--crawl', 'start crawler')  // true or false
      .option('--crawlforever', 'start crawler forever')
      .option('--server', 'start restful server')
      .parse(process.argv);

    if (program.add && program.title) {
        var url   = program.add,
            title = program.title;

        if ( urlUtil.isUrl(url) ) {
            url = urlUtil.addSlash(url);
            co(function *(){
                yield insertSite(url, title);
                console.log('add success');
            }).then(function(){
                db.close();
            }, function(err){
                console.error(err);
            });
        } else {
            console.error(url, ' is not a valid url');
        }
    } else if (program.crawl) {
        crawlAllSites().then(function(){
            db.close();
        }, function(err){
            console.error(err);
        });
    } else if (program.crawlforever) {

    } else if (program.server) {
        server();
    }
}


///////////////////

// createTable();

co(function* () {
    ////
    // yield insertSite("http://www.douban.com", "douban");
    // yield insertLine(1, 2015, 10, 3, '[]');

    ////
    // sites = yield selectSites();
    // console.log(r);
    // r = yield selectLine(1, 2015, 10, 3);
    // console.log(r);

    ////
    // sites = yield selectSites();
    // for (var idx=0; idx < sites.length; ++idx) {
    //     item = sites[idx];
    //     urls = yield urlUtil.getUrls(item.url);

    //     if (config.crawler.compact) {
    //         console.log('compact');
    //         urls = urlUtil.compactUrls(urls);
    //     }
    //     console.log(helper.obj2json(urls));
    //     yield insertLine(item.id, 2015, 12, 7, helper.obj2json(urls));
    // }

    // urls = yield urlUtil.getUrls('http://www.ifeng.com');
    // console.log(urlUtil.compactUrls(urls));

});

main();

