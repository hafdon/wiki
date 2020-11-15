with fy as (
  select ('2020-07-01')::date as s,
    ('2021-06-30')::date as e
),
still_working as (
  select g.name_upper,
    -- ls.leave_seniority_start_date as start_date,

    
   date_part('year', age( fy.e, ls.leave_seniority_start_date )) as anniversary_year,
    
    g.ee_id
  from public.leave_seniority ls,
    hr_schema.org_tenure ot,
    public.g_ids g,
    fy 
  where ot.ee_id = ls.ee_id
    and ot.ee_id = g.ee_id
    and org_closeout_date is null
)
/*
will need to get applicable subgroup_code tuple if more than one
*/
, a as (
select sw.* ,  
esl.eesubgroup_code from still_working sw, ee_subgroup_link esl
where sw.ee_id = esl.ee_id)

, b as (
select a.*, lat.hours_accrued_annually from a, hr_schema.leave_accrual_table lat
where a.eesubgroup_code = lat.eesubgroup_code
and lat.scheme_description = 'jmrl_scheme_fy_2021'
and lat.years_of_service_low < a.anniversary_year
-- inclusive on the higher value only
and lat.years_of_service_high >= a.anniversary_year

)
, wage_rates_recent as (
select wr.ee_id, wr.wage, rank() over (partition by wr.ee_id order by wr.wage_start_date desc) from hr_schema.wage_rates wr
),

annual_hourly_wage_cost_cte as (
select b.*, wrr.wage, b.hours_accrued_annually * wrr.wage as annual_hourly_wage_cost from b, wage_rates_recent wrr
where
wrr.rank = 1
and b.ee_id = wrr.ee_id)

-- select sum(annual_hourly_wage_cost) from annual_hourly_wage_cost_cte;
select * from annual_hourly_wage_cost_cte;
