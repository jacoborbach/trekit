insert into trip_info (trip_id, start_date, end_date, rating, "comment")

VALUES ($1, $2, $3, $4, $5)

returning trip_id, start_date, end_date, rating, "comment";