select  count (distinct country) as "countries"
from trips
where user_id = $1;