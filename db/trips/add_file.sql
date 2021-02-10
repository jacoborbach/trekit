update trip_info
set file = $1
where trip_id = $2

returning trip_id, start_date, end_date, rating, comment, file