module.exports = {
    newtrip: async (req, res) => {
        const { id, name, lat, lng } = req.body
        // console.log(req.body)
        const db = req.app.get('db')
        // console.log(req.session.user)
        const splitName = name.split(', ');
        const city = splitName.shift();
        const country = splitName.pop()

        const [addedtrip] = await db.trips.create_trip(city, lat, lng, id, country)
        // console.log(addedtrip)
        return res.status(201).send(addedtrip)
    },
    // handle submit
    tripInfo: async (req, res) => {
        // const { id } = req.params;
        // console.log(req.body)
        const { id, startDate, endDate, ratingInp, commentInp } = req.body;
        const db = req.app.get('db');

        const [sentInfo] = await db.trips.create_trip_info(id, startDate, endDate, ratingInp, commentInp)

        return res.status(201).send(sentInfo)


    },
    editTrip: async (req, res) => {
        const { trip_id, start_date, end_date, rating, comment } = req.body;
        const db = req.app.get('db')

        const [tripUpdated] = await db.trips.edit_trip(trip_id, start_date, end_date, rating, comment)

        // console.log(tripUpdated)

        return res.status(200).send(tripUpdated)

    },
    deleteTrip: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')
        // console.log(req.session.user)
        // console.log(id)
        const newMarkers = await db.trips.delete_trip(id, 1)
        // console.log(newMarkers)
        const count = await db.trips.count_trips(1)

        return res.status(200).send({ count, newMarkers })
    },
    saveFile: async (req, res) => {
        const { url, trip_id } = req.body;
        const db = req.app.get('db')

        const [saved] = db.trips.add_file(url, trip_id)
        // console.log(saved)
        return res.status(200).send(saved)
    }
}