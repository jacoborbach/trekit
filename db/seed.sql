create table users (
id serial primary key,
first_name varchar NOT NULL,
last_name varchar NOT NULL,
email varchar NOT NULL,
password varchar(500) NOT NULL
);


create table trips (
id serial primary key,
user_id int references users(id) on delete cascade,
city varchar,
country varchar,
lat numeric,
lng numeric
);


create table trip_info (
id serial primary key,
trip_id int references trips(id) on delete cascade,
start_date date default current_date, 
end_date date default current_date,
rating int, CHECK (rating >= 1 and rating <= 5), 
"comment" varchar (1200)
);

create table itineraries(
id serial primary key,
trip_info_id int references trip_info(id) on delete cascade,
file_name varchar(1200)
);