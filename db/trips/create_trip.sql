insert into trips (city, lat, lng, user_id, country)
VALUES ($1, $2, $3, $4, $5)

RETURNING id as trip_id;