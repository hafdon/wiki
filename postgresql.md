# postgresql queries, notes, etc

## general postgresql

## get table name
https://www.postgresql.org/docs/11/ddl-inherit.html

Writing \* is not necessary, since this behavior is always the default. However, this syntax is still supported for compatibility with older releases where the default could be changed.

In some cases you might wish to know which table a particular row originated from. There is a system column called tableoid in each table which can tell you the originating table:

```postgresql
SELECT c.tableoid, c.name, c.altitude
FROM cities c
WHERE c.altitude > 500;
which returns:
```

| tableoid | name      | altitude |
| -------- | --------- | -------- |
| 139793   | Las Vegas | 2174     |
| 139793   | Mariposa  | 1953     |
| 139798   | Madison   | 845      |

(If you try to reproduce this example, you will probably get different numeric OIDs.) By doing a join with pg_class you can see the actual table names:

```postgresql
SELECT p.relname, c.name, c.altitude
FROM cities c, pg_class p
WHERE c.altitude > 500 AND c.tableoid = p.oid;
```

which returns:

| relname  | name      | altitude |
| -------- | --------- | -------- |
| cities   | Las Vegas | 2174     |
| cities   | Mariposa  | 1953     |
| capitals | Madison   | 845      |


## adding sequence to existing table

```sql
iii_fs_db = >
alter table item_code_audit
alter column
  id
set
  default nextval('item_code_audit_id_seq');
ALTER TABLE
```

## join lateral
(apparently fixes subquery returned more than 1 row error)
https://dba.stackexchange.com/questions/97903/call-function-where-argument-is-a-subselect-statement

The modern syntax for this (Postgres 9.3+) would be a LATERAL join:

```sql
SELECT f.* 
FROM   tableX t, test_function(t.customerid) f
WHERE  t.id = 1;
```

Which is short syntax for:

```sql
SELECT f.* 
FROM   tableX t
CROSS  JOIN LATERAL test_function(t.customerid) f
WHERE  t.id = 1;
```

### foreign table wrapper

```sql
set
  role postgres;
CREATE EXTENSION postgres_fdw with schema iii_fs_schema;
create server iii_fs_server foreign data wrapper postgres_fdw options (
    host '34.231.47.190',
    dbname 'iii',
    port '1032'
  );
alter server iii_fs_server owner to iii_fs_admin;
create user mapping for iii_fs_admin server iii_fs_server options (user 'zaw2', password 'f@ulkner');
set
  role iii_fs_admin;
import foreign schema sierra_view
limit
  to (circ_trans, hold, item_circ_history, checkout)
from
  server iii_fs_server into iii_fs_schema;
--
  --
  --
  create table iii_fs_audit_schema.checkout_audit (
    operation varchar(1),
    stamp timestamptz,
    patron_record_id bigint,
    item_record_id bigint,
    checkout_gmt timestamp,
    ptype int2
  );
--
  --
  --
  CREATE
  OR REPLACE FUNCTION process_checkout_audit() RETURNS trigger AS $BODY$ BEGIN IF (TG_OP = 'INSERT') THEN
INSERT INTO
  iii_fs_audit_schema.checkout_audit
SELECT
  'I',
  now(),
  new.patron_record_id,
  new.item_record_it,
  new.checkout_gmt,
  new.ptype;
RETURN NEW;
END IF;
RETURN null;
END;
$BODY$ LANGUAGE plpgsql;
--
--
CREATE TRIGGER checkout_audit
AFTER
INSERT
  on iii_fs_schema.checkout FOR EACH ROW EXECUTE PROCEDURE process_checkout_audit();
```

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
#### if having problems returning after using data modifying cte, 
- see: https://stackoverflow.com/questions/47988816/with-clause-containing-a-data-modifying-statement-must-be-at-the-top-level-sql-s

### create or replace function returns table row and references parameters
```sql
create or replace function hr_api.insert_eeid(
    name_upper text,
    ee_id int,
    email text,
    initials text
  ) returns setof g_ids as $$ begin return query
insert into g_ids (name_upper, g_id, ee_id, email, initials)
values (
    insert_eeid.name_upper,
    insert_eeid.ee_id,
    insert_eeid.ee_id,
    insert_eeid.email,
    insert_eeid.initials
  )
returning *;
end;
$$ language plpgsql;
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

### show permissions on tables

```sql
hr=# SELECT grantee, privilege_type 
hr-# FROM information_schema.role_table_grants 
hr-# WHERE table_name='leaveslips_view';
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
## ERROR: functions in index expression must be marked IMMUTABLE in Postgres
```sql
create index on <<schema>>.<<table>> ( date(timezone('UTC', <<column_name>>) ));
```

You will have to construct your queries something like this to take advantage of it:  
- (just doing `scan_date::date` isn't going to use the index)

```sql
collection=>   explain analyze verbose select * from scans where date(timezone('UTC', scan_date)) = (now()::date) ;
                                                           QUERY PLAN                                         
                  
--------------------------------------------------------------------------------------------------------------
------------------
 Bitmap Heap Scan on collection_schema.scans  (cost=5.73..293.81 rows=185 width=43) (actual time=0.125..0.193 
rows=122 loops=1)
   Output: id, barcode, user_id, scan_date, location, notes, ssp, delete_date
   Recheck Cond: (date(timezone('UTC'::text, scans.scan_date)) = (now())::date)
   Heap Blocks: exact=2
   ->  Bitmap Index Scan on scans_date_idx  (cost=0.00..5.68 rows=185 width=0) (actual time=0.106..0.106 rows=
122 loops=1)
         Index Cond: (date(timezone('UTC'::text, scans.scan_date)) = (now())::date)
 Planning Time: 0.156 ms
 Execution Time: 0.258 ms
(8 rows)
```

## get function names
```sql
SELECT format('%I.%I(%s)', ns.nspname, p.proname, oidvectortypes(p.proargtypes)) 
FROM pg_proc p INNER JOIN pg_namespace ns ON (p.pronamespace = ns.oid)
where ns.nspname = 'hr_api';
```
