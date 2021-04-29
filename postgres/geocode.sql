select
  barcode,
  ptype_code,
  description,
  patron_record_address_type_id,
  addr1,
  addr2,
  addr3,
  village,
  city,
  region,
  postal_code,
  country
from
  sierra_view.patron_view
  left join sierra_view.ptype_property_name on ptype_property_name.ptype_id = patron_view.ptype_code
  LEFT JOIN sierra_view.patron_record_address on patron_view.id = patron_record_address.patron_record_id
where
  -- patron_record_address_type_id = 1   and
  city is not null
  and record_num in ('1000066');
