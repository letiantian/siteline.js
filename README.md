# siteline

只有utf8网页被支持

```
crawler_cli --add <url> --title <title>
crawler_cli --add http://www.zhihu.com --title 每日知乎


crawler_cli --compact

crawler_cli --list

crawler_cli --rm <url>

crawler_cli --retitle <url>
```

检查与前两天是否有重复的url



## How to use sqlite 3

```
sudo apt-get instal sqlite3

sqlite> .schema tags
CREATE TABLE "tags" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "tag" TEXT NOT NULL
);
sqlite> .schema links
CREATE TABLE "links" (
    "tag_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "content" TEXT NOT NULL
);

sqlite> .indices tags
sqlite> .indices links
links_index

sqlite> PRAGMA table_info(links);
0|tag_id|INTEGER|1||0
1|url|TEXT|1||0
2|year|INTEGER|1||0
3|month|INTEGER|1||0
4|day|INTEGER|1||0
5|hour|INTEGER|1||0
6|content|TEXT|1||0
sqlite> PRAGMA table_info(tags);
0|id|INTEGER|1||1
1|tag|TEXT|1||0

CREATE UNIQUE INDEX index_name
on table_name (column_name);

```







```SQL
CREATE TABLE "sites" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

CREATE UNIQUE INDEX uq_sites_url
on sites (url);

CREATE UNIQUE INDEX uq_sites_title
on sites (title);


CREATE TABLE "lines" (
    "site_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
);

CREATE UNIQUE INDEX uq_lines_date 
on lines (year, month, day);

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


