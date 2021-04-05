select first_name 
from users
WHERE LOWER(first_name) LIKE LOWER($1)


-- where first_name LIKE '%${j}'
-- ja