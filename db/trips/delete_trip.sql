delete from trips 
where id = $1;

-- select t.country, t.city, t.lat, t.lng, t.id as trip_id, ti.start_date, ti.end_date, ti.rating, "comment", ti.file
-- from users u join trips t 
-- on u.id = t.user_id
-- full join trip_info ti on t.id = ti.trip_id
-- where u.id = $2;