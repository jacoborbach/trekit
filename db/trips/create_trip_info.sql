insert into trip_info (trip_id, start_date, end_date, rating, "comment")

VALUES ($1, $2, $3, $4, $5)

returning trip_id, start_date, end_date, rating, "comment";

-- this worked
-- insert into trip_info (trip_id, start_date, end_date, rating, "comment")

-- VALUES (77, '1980-01-01','2005-01-01', 4, 'Trip was gggggreat')