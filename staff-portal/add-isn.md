# logic for adding an isn to suggestion

1. click "add" in the isn form input control
1. client calls `POST: api/v1/collection/suggestions/isn`, passing the `suggestion_id` and the `isn_identifier`
1. 

we get back something like this
```
data:
bib_info: Array(1)
0:
bib_info: Array(1)
0:
bib_view_info: Array(1)
0:
allocation_rule_code: "0"
bcode1: "m"
bcode2: "a"
bcode3: "-"
cataloging_date_gmt: "2020-07-25T00:00:00-04:00"
country_code: "nyu"
id: 420908266248
index_change_count: 4
is_available_at_library: false
is_on_course_reserve: false
is_right_result_exact: false
language_code: "eng"
marc_type_code: " "
record_creation_date_gmt: "2020-07-02T16:30:38-04:00"
record_num: 1471240
record_type_code: "b"
skip_num: 0
title: "My wife said you may want to marry me : a memoir"
__proto__: Object
length: 1
__proto__: Array(0)
brecnum: 1471240
identifiers: ["9780062940599"]
__proto__: Object
length: 1
__proto__: Array(0)
suggestion_id: 12365
__proto__: Object
length: 1
__proto__: Array(0)
isn_info: Array(1)
0: {suggestion_id: 12365, identifier: "9780062940599"}
length: 1
__proto__: Array(0)
suggestion_id: 12365


```
