
### create a unique index : max one null per x
`create unique index idx_accrual_rates_max_one_null on accrual_rates (g_id) where end_date is null;`
