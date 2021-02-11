update trip_info
set file = $1
where trip_id = $2

returning file;