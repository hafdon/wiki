
Will show functions in all schemas in database

```sql
SELECT routine_name, specific_schema FROM information_schema.routines 
        WHERE routine_type='FUNCTION';
```
