insert into trips (lat, lng, user_id, country, city, "name", typesString)
VALUES ($1, $2, $3, $4, $5, $6, $7)

RETURNING id as trip_id;