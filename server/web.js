var koa = require('koa');

var route = require('koa-route');

var bodyParser = require('koa-body-parser');
var parse = require('co-body');
var views = require('co-views');
var serve = require('koa-static');

var app = koa();

var render = views(__dirname + '/views', { map: { html: 'ejs' } });

var cache = require("lru-cache")({ max: 100, maxAge: 1000 * 60 * 10 });


app.use(serve(__dirname + '/static'));
app.use( require('koa-json')() );

app.use(route.get('/', index));
app.use(route.get('/sites', showSites));
app.use(route.post('/sites/:id', showLines));

function *index() {
    this.body = yield render('index', { id: 1 });
}

function *showSites() {
    // this.body = "sites";
    this.body = [12,3,4, '123']
}

function *showLines(id) {
    console.log(this.request.method);
    console.log(this.request);
    jsonData = yield parse.json(this);  // get data from request body, http://stackoverflow.com/questions/22148087/request-body-is-undefined-in-koa
    console.log(jsonData);

    this.body = ""+id + jsonData;

}

app.listen(3000);
console.log('listening on port 3000');