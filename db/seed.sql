
create table users (
id serial primary key,
first_name varchar NOT NULL,
last_name varchar NOT NULL,
email varchar NOT NULL,
password varchar(500) NOT NULL
);

create table trip_info (
id serial primary key,
trip_id int references trips(id) on delete cascade,
start_date date default current_date, 
end_date date default current_date,
rating int, CHECK (rating >= 1 and rating <= 5), 
"comment" varchar (1200)
);

create table trips (
id serial primary key,
user_id int references users(id) on delete cascade,
"name" varchar
city varchar,
country varchar,
-- type is the type of place it is, ie bar
type1 char,
lat numeric,
lng numeric
);