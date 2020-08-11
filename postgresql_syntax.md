```sql
hr=> begin; delete from leaveslips where id = (select id from leaveslips where g_id = 1637 and request_status_id != 7) returning *;
BEGIN
ERROR:  more than one row returned by a subquery used as an expression
hr=> abort;
ROLLBACK
hr=> begin; delete from leaveslips where id = any select id from leaveslips where g_id = 1637 and request_status_id != 7 returning *;
BEGIN
ERROR:  syntax error at or near "select"
LINE 1: delete from leaveslips where id = any select id from leavesl...
                                              ^
hr=> abort; begin; delete from leaveslips where id = any ( select id from leaveslips where g_id = 1637 and request_status_id != 7 ) returning *;
ROLLBACK
```

## assorted notes

I. Going from HOME to STAFF
AT HOME
pg_dump -U <user> -F d -f <target_file> <database_to_dump>
AT STAFF
delete target database
create target database name only
pg_restore -U <user> -d <dbname> <file>

with pg_restore use the -d option to connect directly to the database when the dump was in directory format  
For scooter, you have to (1) (from work) do pg_dump -U starkat -F p -f --filename-- --targetdb-- 
For scooter, then to upload, you do (2) (from scooter)  psql -U postgres --targetdb-- < --file-- 
