
### create a unique index : max one null per x
```aqlcreate unique index idx_accrual_rates_max_one_null on accrual_rates (g_id) where end_date is null;
```

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
