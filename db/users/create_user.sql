insert into users (first_name, last_name, email, password)
values($1, $2, LOWER($3) , $4);

select * from users where email = LOWER($3);