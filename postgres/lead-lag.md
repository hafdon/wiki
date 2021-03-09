# use `LEAD` or `LAG` for calculating change in leave month by month

THE LEAD() AND LAG() FUNCTIONS
While the ntile() function is essential for splitting a dataset into groups, the lead() and lag() functions are here to move lines within the result set. A typical use case is to calculate the difference in production from one year to the next, as shown in the following example:

```sql
test=# SELECT year, production, 
              lag(production, 1) OVER (ORDER BY year) 
       FROM  t_oil 
       WHERE country = 'Mexico' 
       LIMIT 5; 
 year  | production | lag 
-------+------------+----- 
 1965  |        362 | 
 1966  |        370 | 362
 1967  |        411 | 370
 1968  |        439 | 411
 1969  |        461 | 439
(5 rows)
```

Before actually calculating the change in production, it makes sense to sit back and see what the lag() function actually does. You can see that the column is moved by one row. The data moved as defined in the ORDER BY clause. In my example, this means down. An ORDER BY DESC clause would, of course, have moved the data up.

From this point on, the query is easy:

test=# SELECT year, production, 
              production - lag(production, 1) OVER (ORDER BY year) 
       FROM  t_oil 
       WHERE country = 'Mexico' 
       LIMIT 3; 
 year | production | ?column? 
------+------------+---------- 
 1965 |        362 | 
 1966 |        370 |      8 
 1967 |        411 |     41 
(3 rows) 
All you have to do is to calculate the difference like you would with any other column. Note that the lag() function has two parameters. The first one indicates which column is to be displayed. The second column tells PostgreSQL how many rows you want to move. Putting in 7, then, means that everything is off by seven rows.

Note that the first value is Null (as are all of the other lagged rows without a preceding value).

The lead() function is the counterpart of the lag() function; it will move rows up instead of down:

test=# SELECT year, production, 
              production - lead(production, 1) OVER (ORDER BY year) 
       FROM  t_oil 
       WHERE country = 'Mexico' 
       LIMIT 3; 
 year  | production | ?column? 
-------+------------+----------
 1965  |        362 |     -8
 1966  |        370 |    -41
 1967  |        411 |    -28

(3 rows) 
Basically, PostgreSQL will also accept negative values for lead and lag columns. lag(production, -1) is therefore a replacement for lead(production, 1). However, it is definitely cleaner to use the right function to move data in the direction you want.

So far, you have seen how to lag a single column. In most applications, lagging a single value will be the standard case used by most developers. The point is, PostgreSQL can do a lot more than that. It is possible to lag entire lines:

test=# \x 
Expanded display is on. 
test=# SELECT year, production, 
              lag(t_oil, 1) OVER (ORDER BY year) 
       FROM  t_oil 
       WHERE country = 'USA' 
       LIMIT 3; 
-[ RECORD 1 ]------------------------------------- 
year          | 1965 
production    | 9014 
lag           | 
-[ RECORD 2 ]------------------------------------- 
year          | 1966 
production    | 9579 
lag           | ("North America",USA,1965,9014,11522) 
-[ RECORD 3 ]------------------------------------- 
year          | 1967 
production    | 10219 
lag           | ("North America",USA,1966,9579,12100) 
The beauty here is that more than just a single value can be compared to the previous row. The trouble, though, is that PostgreSQL will return the entire row as a composite type and therefore it is hard to work with. To dissect a composite type, you can use parentheses and a star:

test=# SELECT year, production, 
              (lag(t_oil, 1) OVER (ORDER BY year)).* 
       FROM  t_oil 
       WHERE country = 'USA' 
       LIMIT 3; 
 year | prod  | region     | country | year | prod | consumption 
------+-------+------------+---------+------+------+------------- 
 1965 | 9014  |            |         |      |      | 
 1966 | 9579  | N. America |     USA | 1965 | 9014 | 11522 
 1967 | 10219 | N. America |     USA | 1966 | 9579 | 12100 
(3 rows) 
Why is that useful? Lagging an entire row will make it possible to see whether the data has been inserted more than once. It is pretty simple to detect duplicate rows (or close-to-duplicate rows) in your time series data.

Check out the following example:

test=# SELECT * 
       FROM (SELECT t_oil, lag(t_oil) OVER (ORDER BY year) 
             FROM  t_oil 
             WHERE country = 'USA'
       ) AS x 
       WHERE t_oil = lag; 
 t_oil  | lag 
--------+-----  
(0 rows) 
Of course, the sample data doesn't contain duplicates. However, in real-world examples, duplicates can easily happen, and it is easy to detect them, even if there is no primary key.

The t_oil row is really the entire row. The lag returned by sub-select is also a complete row. In PostgreSQL, composite types can be compared directly in case the fields are identical. PostgreSQL will simply compare one field after the other.
