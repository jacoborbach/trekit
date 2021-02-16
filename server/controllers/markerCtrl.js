module.exports = {
    newtrip: async (req, res) => {
        const { id, name, lat, lng } = req.body
        const db = req.app.get('db')

        // extracity city and country names 
        const splitName = name.split(', ');
        const city = splitName.shift();
        const country = splitName.pop()

        const [addedtrip] = await db.trips.create_trip(city, lat, lng, id, country)
        // console.log(addedtrip)
        return res.status(201).send(addedtrip)
    },
    // handle submit
    tripInfo: async (req, res) => {
        const { trip_id, startDate, endDate, ratingInp, commentInp } = req.body;
        const db = req.app.get('db');

        const [sentInfo] = await db.trips.create_trip_info(trip_id, startDate, endDate, ratingInp, commentInp)

        return res.status(201).send(sentInfo)


    },
    editTrip: async (req, res) => {
        const { trip_id, start_date, end_date, rating, comment } = req.body;
        const db = req.app.get('db')

        const [tripUpdated] = await db.trips.edit_trip(trip_id, start_date, end_date, rating, comment)

        return res.status(200).send(tripUpdated)

    },
    deleteTrip: async (req, res) => {
        console.log('params:', req.params)
        console.log('body:', req.body)
        const { id } = req.params
        const { user_id } = req.body;
        const db = req.app.get('db');
        // console.log(id)

        const newMarkers = await db.trips.delete_trip(id, user_id)
        const count = await db.trips.count_trips(user_id)
        // console.log(count, newMarkers)
        return res.status(200).send({ count, newMarkers })
    },
    // deleteFile: async (req, res) => {
    //     const { trip_id } = req.body
    //     const db = req.app.get('db')

    //     const [returnData] = await db.trips.delete_file(trip_id)
    //     console.log(returnData)

    //     return res.status(200).send(returnData)
    // },
    saveFile: async (req, res) => {
        const { url, trip_id } = req.body;
        const db = req.app.get('db')

        const [saved] = await db.trips.add_file(url, trip_id)
        return res.status(200).send(saved)
    }
}