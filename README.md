# siteline

[![Build Status](https://travis-ci.org/someus/siteline.js.svg)](https://travis-ci.org/someus/siteline.js)

Save the timeline of websites. Only pages encoded with **utf-8** are supported.

The node should support **Promise** and **Generator**.

## crawler 

Add site:
```
$ node crawler_cli --add http://www.zhihu.com --title 每日知乎
```

Show all sites:
```
$ node crawler_cli --list
```

Crawl: 
```
$ node crawler_cli --crawl
```


## web server

```
$ node server/web.js
```

## Test

```
$ npm install mocha -g
$ mocha
```


## Dependences
```
$ npm install
```


```
$ sudo apt-get instal sqlite3
$ sqlite3 foo.db
```

## DB Schema
```SQL
CREATE TABLE sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL
);

CREATE UNIQUE INDEX uq_sites_url
on sites (url);

CREATE UNIQUE INDEX uq_sites_title
on sites (title);


CREATE TABLE lines (
    site_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    content TEXT NOT NULL,
);

CREATE UNIQUE INDEX uq_lines_date 
on lines (year, month, day);
```

## Run forever
Here is a sample based on supervisor and nginx in Ubuntu.

**/etc/supervisor/conf.d/siteline-server.conf**
```
[program:siteline-server]
command=/usr/local/bin/node /path/to/siteline.js/server/web.js
autostart=true
autorestart=true
user=username
stderr_logfile=/path/to/siteline.js/supervisor.err.log
```

**/etc/supervisor/conf.d/siteline-crawler.conf**
```
[program:siteline-crawler]
command=/usr/local/bin/node /path/to/siteline.js/crawler_cli.js --crawlforever
autostart=true
autorestart=true
user=username
```

**/etc/nginx/sites-enabled/siteline.conf**
```
upstream siteline {
    server 127.0.0.1:4567;
}

server 
{
    listen 80;
    server_name your.domain.com;
    server_name_in_redirect  off;
    access_log  off;
    
    #root /path/to/siteline.js;
    error_log /path/to/siteline.js/nginx-error.log;

    # Allow file uploads
    client_max_body_size 1M;

    proxy_read_timeout 10;

    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://siteline;
    }
}
```

## License
MIT