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
  select
    *
  from jsonb_to_record($1 :: jsonb) as x(identifier text, suggestion_id int)
),
params as (
  select
    identifier :: text,
    suggestion_id :: int
  from p
),
/**
Insert as a new row in the isn table (no links)
if the identifier is not in there already
*/
new_row AS (
  INSERT INTO collection_schema.isns (identifier)
  SELECT
    params.identifier as identifier
  from params
  WHERE
    NOT EXISTS (
      SELECT
        isns.id
      FROM collection_schema.isns,
        params
      WHERE
        isns.identifier = params.identifier
    ) RETURNING *
)
/*
Insert into the link table
 the suggestion_id and isn_id

 from our new row, if the isn did not exist
 or from the isn table, if the isn already existed
*/,
link_info as (
  insert into collection_schema.suggestion_isn_link (suggestion_id, isn_id)
  SELECT
    params.suggestion_id,
    new_row.id
  FROM new_row,
    params
  UNION
  SELECT
    params.suggestion_id,
    isns.id
  FROM collection_schema.isns,
    params
  WHERE
    isns.identifier = (
      select
        identifier
      from params
    ) returning *,
    (
      select
        identifier
      from params
    )
)
select
  params.suggestion_id,
  isns.identifier
from collection_schema.suggestion_isn_link,
  collection_schema.isns,
  params
where
  suggestion_isn_link.suggestion_id = params.suggestion_id
  and isns.id = suggestion_isn_link.isn_id
union
select
  suggestion_id,
  identifier
from link_info;
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
