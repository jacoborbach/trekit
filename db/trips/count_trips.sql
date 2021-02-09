select count (distinct city) as "cities", count (distinct country) as "countries"
from trips
where user_id = $1;