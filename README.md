# siteline

Save the timeline of websites. Only pages encoded with utf-8 are supported.

The node should support Promise and Generator.

## crawler 

Add site:
```
crawler_cli --add http://www.zhihu.com --title 每日知乎
```

Show all sites:
```
crawler_cli --list
```

Crawl: 
```
crawler_cli --crawl
```


## web server

```
node server/web.js
```

## How to use sqlite 3

```
$ sudo apt-get instal sqlite3
$ sqlite3 foo.db
```


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


