var koa = require('koa');
var route = require('koa-route');
var bodyParser = require('koa-body-parser');
var parse = require('co-body');
var views = require('co-views');
var serve = require('koa-static');
var app = koa();
var render = views(__dirname + '/views', { map: { html: 'ejs' } });
var cache = require("lru-cache")({ max: 100, maxAge: 1000 * 60 * 10 });


var sqlite3 = require('sqlite3').verbose();
var config   = require('../config');
var db = new sqlite3.Database(config.dbpath);
var dbUtil   = require('../util/db');
var helper   = require('../util/helper');
var config   = require('../config');


app.use(serve(__dirname + '/static'));
app.use( require('koa-json')() );

app.use(route.get('/', index));
app.use(route.post('/sites', showSites));
app.use(route.post('/sites/:id', showLines));

function *index() {    
    var sites = cache.get("sites")
    if (!sites) {
        sites = yield dbUtil.selectSites(db);
    }

    this.body = yield render('index', { sites: sites });
}

function *showSites() {
    var sites = cache.get("sites")
    if (!sites) {
        sites = yield dbUtil.selectSites(db);
    }
    this.body = {error: false, info:'', data:sites};
}

function *showLines(id) {
    try {
        jsonData = yield parse.json(this);  // get data from request body, http://stackoverflow.com/questions/22148087/request-body-is-undefined-in-koa
        // console.log(jsonData);
        key = ""+id+"-"+jsonData.year+"-"+jsonData.month+"-"+jsonData.day;
        var result = cache.get(key);
        if(!result) {
            result = yield dbUtil.selectLine(db, id, jsonData.year, jsonData.month, jsonData.day);
        }
        // console.log(result);
        this.body = {error: false, info:'', data:helper.json2obj(result.content)};
    } catch(err) {
        this.body = {error: true, info:''+err};
    }

}

app.listen(config.server.port, config.server.host);
console.log('listening on ' + config.server.host + ':'+config.server.port);