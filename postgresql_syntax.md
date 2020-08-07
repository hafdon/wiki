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
