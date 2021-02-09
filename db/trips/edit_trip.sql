update trip_info
set start_date = $2, end_date = $3, rating = $4, "comment" = $5 
where trip_id = $1

returning trip_id, start_date, end_date, rating, "comment";