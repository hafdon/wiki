# postgresql queries, notes, etc

## general postgresql

### getting function information
https://stackoverflow.com/questions/6898453/how-to-display-the-function-procedure-triggers-source-code-in-postgresql

### backing up and encrypting by database with pg_dump
https://www.imagescape.com/blog/2015/12/18/encrypted-postgres-backups/

### outputting the results of a query to a file using cli
```sql
pg -U colladmin collection -c "\copy 
(select barcode from collection_schema.scans where delete_date::date = now()::date) 
to '~/ttt.csv' with (FORMAT CSV)"
```

### show prepared statements for session
```sql
select * from pg_catalog.pg_prepared_statements ;

\d pg_catalog.pg_prepared_statements -- << can also use \d with it
```

### get column information
```sql


SELECT *
  FROM information_schema.columns
 WHERE table_schema = 'your_schema'
   AND table_name   = 'your_table'
     ;


select
  column_name || ','
from information_schema.columns
where
  table_schema = 'collection_schema'
  and table_name = 'withdrawals';
  --   --
select
  '$' || row_number() over() || ','
from information_schema.columns
where
  table_schema = 'collection_schema'
  and table_name = 'withdrawals';
```

### create a unique index : max one null per x
```sql
create unique index <index_name> on <table> (<column a>)
where <column b that can only be null once per column a in table> is null;
```

### pass json params
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
### create or replace function returns datatype
```sql
create or replace function compareEeId(int, int) returns boolean as $$ begin return (
    select g.id
    from g_ids g
    where $1 in (g.g_id, g.ee_id)
  ) = (
    select g.id
    from g_ids g
    where $2 in (g.g_id, g.ee_id)
  );
end;
$$ language plpgsql immutable strict;
```

### create or replace function returns table row
```sql
create or replace function upsert_carryover (
        f_id int,
        f_ee_id int,
        f_vacation numeric,
        f_sick numeric,
        f_to_fy_id int
    ) returns table (
        id int,
        g_id int,
        vacation numeric,
        sick numeric,
        to_fy_id int,
        create_date timestamptz
    ) as $$ begin return query with new_row as (
        insert into public.carryover_to (g_id, vacation, sick, to_fy_id)
        select f_ee_id,
            f_vacation,
            f_sick,
            f_to_fy_id
        where not exists (
                select carryover_to.id
                from public.carryover_to
                where carryover_to.id = f_id
            )
        returning *
    ),
    updated_row as (
        update public.carryover_to
        set vacation = f_vacation,
            sick = f_sick,
            to_fy_id = f_to_fy_id
        where carryover_to.id = f_id
        returning *
    )
select *
from updated_row
union
select *
from new_row;
end;
$$ language plpgsql;
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

## sierra dna (iii database)

### -- isn search on phrase_entry table

Queries must take the form seen below in order to take advantage of the phrase_entry indexes / optimizations.

```sql
SELECT
id2reckey(e.record_id)
FROM
sierra_view.phrase_entry as e
WHERE
e.index_tag || e.index_entry = 'i' || LOWER('9780525658351');
```


