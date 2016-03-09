var co = require('co');

function execute(dbConn, sql, params) {
    return new Promise(function(resolve, reject) {
        dbConn.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


function findAll(dbConn, sql, params) {
    return new Promise(function(resolve, reject){
        dbConn.all(sql, params,function(err, rows) {
            if(err) {
                reject(err);
            }
            else {
                resolve(rows);  // 若没有数据，rows则是空数组
            }
        });
    });
}

function findOne(dbConn, sql, params) {
    return new Promise(function(resolve, reject){
        dbConn.get(sql, params, function(err, row) {
            if (err){
                reject(err);
            }
            else{
                resolve(row);   // 若没有数据，则为undefined
            }
        });
    });
}


function *createTable(dbConn) {
    var sql01 = `                                                 
            CREATE TABLE IF NOT EXISTS sites (                                
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,  
                url TEXT NOT NULL,                              
                title TEXT NOT NULL                             
            );                                                  
        `;
    var sql02 = `
            CREATE UNIQUE INDEX IF NOT EXISTS uq_sites_url    
            on sites (url);                     
        `;

    var sql03 = `
            CREATE UNIQUE INDEX IF NOT EXISTS uq_sites_title  
            on sites (title);                   
        `;

    var sql04 = `
            CREATE TABLE IF NOT EXISTS lines (       
                site_id INTEGER NOT NULL, 
                year INTEGER NOT NULL,    
                month INTEGER NOT NULL,   
                day INTEGER NOT NULL,     
                content TEXT NOT NULL   
            );                            
        `;

    var sql05 = `
            CREATE UNIQUE INDEX IF NOT EXISTS uq_lines_date   
            on lines (site_id, year, month, day);        
        `;

    yield execute(dbConn, sql01, []);
    yield execute(dbConn, sql02, []);
    yield execute(dbConn, sql03, []);
    yield execute(dbConn, sql04, []);
    yield execute(dbConn, sql05, []);
}


function *insertSite(dbConn, url, title) {
    var sql = "INSERT INTO sites(url, title) VALUES (?,?)";
    yield execute(dbConn, sql, [url, title]);
}


function *insertLine(dbConn, siteId, year, month, day, content) {
    var sql = "INSERT INTO lines(site_id, year, month, day, content) VALUES (?,?,?,?,?)";
    yield execute(dbConn, sql, [siteId, year, month, day, content]);
}

function *updateLine(dbConn, siteId, year, month, day, content) {
    var sql = "UPDATE lines SET content=? WHERE site_id=? AND year=? AND month=? AND day=?";
    yield execute(dbConn, sql, [content, siteId, year, month, day]);
}


function *selectSites(dbConn) {
    var sql = "SELECT id, url, title FROM sites";
    result = yield findAll(dbConn, sql, []);
    return result;
}

function *selectLine(dbConn, siteId, year, month, day) {
    var sql = "SELECT site_id, year, month, day, content FROM lines WHERE site_id=? AND year=? AND month=? AND day=?";
    result = yield findOne(dbConn, sql, [siteId, year, month, day]);
    return result;
}



exports.execute     = execute;
exports.findOne     = findOne;
exports.findAll     = findAll;
exports.createTable = co.wrap(createTable);
exports.insertSite  = co.wrap(insertSite);
exports.insertLine  = co.wrap(insertLine);
exports.updateLine  = co.wrap(updateLine);
exports.selectSites = co.wrap(selectSites);
exports.selectLine  = co.wrap(selectLine);