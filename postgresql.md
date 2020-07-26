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
### create or replace table returns datatype
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

### create or replace table returns table row
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
### 
