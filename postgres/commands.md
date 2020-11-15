
1. execute the text of a file and output the results to a file  
`psql -U colladmin collection -f select_suggestions_view.sql -o temp.txt -x`
2. get years between two dates
`date_part('year', age( sw.fy_end, sw.start_date ))`
