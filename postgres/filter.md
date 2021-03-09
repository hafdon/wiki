# using `FILTER` instead of `CASE WHEN`

Combining grouping sets with the FILTER clause
In real-world applications, grouping sets can often be combined with FILTER clauses. The idea behind the FILTER clause is to be able to run partial aggregates. Here is an example:

```sql
test=# SELECT region, 
  avg(production) AS all, 
  avg(production) FILTER (WHERE year  < 1990) AS old,  
  avg(production) FILTER (WHERE year  >= 1990) AS new  
FROM t_oil 
GROUP BY ROLLUP (region); 
    region     | all            | old            | new 
---------------+----------------+----------------+---------------- 
 Middle East   | 1992.603686635 | 1747.325892857 | 2254.233333333 
 North America | 4541.362318840 | 4471.653333333 | 4624.349206349 
               | 2607.513986013 | 2430.685618729 | 2801.183150183 
(3 rows) 
```

The idea here is that not all columns will use the same data for aggregation. The FILTER clause allows you to selectively pass data to those aggregates. In this example, the second aggregate will only consider data before 1990, the third aggregate will take care of more recent data, and the first one will get all the data.

If it is possible to move conditions to a WHERE clause, it is always more desirable because less data has to be fetched from the table. FILTER is only useful if the data left by the WHERE clause is not needed by each aggregate.
FILTER works for all kinds of aggregates and offers a simple way to pivot your data. Also, FILTER is faster than mimicking the same behavior with CASE WHEN ... THEN NULL ... ELSE END. You can find some real performance comparisons here: https://www.cybertec-postgresql.com/en/postgresql-9-4-aggregation-filters-they-do-pay-off/.
