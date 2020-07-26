# postgresql queries, notes, etc

## general postgresql

### create a unique index : max one null per x
```sql
create unique index <index_name> on <table> (<column a>)
where <column b that can only be null once per column a in table> is null;
```

### upsert logic flow
```sql
with p as (
    select *
    from json_to_record($1::json) as x(identifier text, suggestion_id int)
),
params as (
    select identifier::text,
        suggestion_id::int
    from p
),
new_row as (
    insert into < table >
    select [data, ...]
    where not exists (
            select < identifier >
            from < table >
            where < table.identifier = params.identifier
        )
    returning *
),
updated_row as (
    update < Table >
    set [data = d, ...]
    where table.identifier = params.identifier
    returning *
)
select *
from updated_row
union
select *
from new_row;
```


## hr database

### staff missing carryover_to for a given fiscal year (does not filter out non-benefitted employees)
```sql
with a as (
    select *
    from org_tenure o
        left join carryover_to r on o.ee_id= r.g_id
        and r.to_fy_id = 2021
        where accrual_rate_overlaps (
            '2020-07-01'::Date,
            now()::Date,
            o.org_start_date,
            o.org_closeout_date
        )
)
select g.name_upper, a.*
from a, g_ids g where to_fy_id is null and g.g_id = a.ee_id order by a.ee_id;
```
### 
