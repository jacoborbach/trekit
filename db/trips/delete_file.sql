update trip_info
set file = null
where trip_id = $1

returning trip_id, start_date, end_date, rating, "comment";