-- select t.country, t.city, t.lat, t.lng, t.id from users u
-- join trips t on u.id = t.user_id
-- where u.id = $1;


-- this is what were going to use
select t.country, t.city, t.lat, t.lng, t.id, ti.start_date, ti.end_date, ti.rating, "comment"
from users u join trips t 
on u.id = t.user_id
full join trip_info ti on t.id = ti.trip_id
where u.id = $1;