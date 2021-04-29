Understanding hypothetical aggregates
Hypothetical aggregates are pretty similar to standard ordered sets. However, they help to answer a different kind of question: what would be the result if a value was in the data? As you can see, this is not about values inside the database, but about the result if a certain value was actually there.

The only hypothetical function that's provided by PostgreSQL is rank, as shown in the following code:

```sql
test=# SELECT region, 
              rank(9000) WITHIN GROUP 
                         (ORDER BY production DESC NULLS LAST) 
FROM t_oil 
GROUP BY ROLLUP (1); 
    region     | rank 
---------------+------ 
 Middle East   |  21 
 North America |  27 
               |  47 
(3 rows)
```

The preceding code tells us this: if somebody produced 9,000 barrels of oil per day, it would be ranked the 27th best year in North America and the 21st best year in Middle East.

In this example, I used NULLS LAST. When data is sorted, nulls are usually at the end. However, if the sort order is reversed, nulls should still be at the end of the list. NULLS LAST ensures exactly that.
