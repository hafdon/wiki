# create a trigger to log an update to a table 

- https://www.postgresql.org/docs/11/plpgsql-trigger.html#PLPGSQL-TRIGGER-AUDIT-EXAMPLE
- https://www.postgresql.org/docs/11/functions-trigger.html
- https://www.postgresql.org/docs/11/sql-createtrigger.html

```sql
create trigger suggestion_state_audit after update of state_id
on collection_schema.suggestions
for each row 
when (NEW.state_id != OLD.state_id)
execute function process_suggestion_state_audit();
```

```sql
create function audit_schema.process_suggestion_state_audit() returns trigger
as $process_suggestion_state_audit$
    BEGIN
    if (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_schema.suggestion_state_log
    (
    suggestion_id,
    old_state_id,
    new_state_id
)
    select 
OLD.id, OLD.state_id, NEW.state_id;
end if;
return null;
end;
$process_suggestion_state_audit$
language plpgsql;
```
