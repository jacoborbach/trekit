module.exports = {
  newtrip: async (req, res) => {
    const { id, city, country, lat, lng } = req.body;
    const db = req.app.get("db");

    const [addedtrip] = await db.trips.create_trip(city, lat, lng, id, country); //returns a trip_id

    req.session.user[1].splice(0, 0, {
      country,
      city,
      lat,
      lng,
      trip_id: addedtrip.trip_id,
      start_date: null,
      end_date: null,
      rating: null,
      comment: null,
      file: null,
    });

    const count = await db.trips.count_trips(id);
    req.session.user[2].splice(0, 1, {
      cities: count[0].cities,
      countries: count[0].countries,
    });

    return res.status(201).send(addedtrip);
  },
  // handle submit
  tripInfo: async (req, res) => {
    const { trip_id, startDate, endDate, ratingInp, commentInp } = req.body;
    const db = req.app.get("db");

    const [sentInfo] = await db.trips.create_trip_info(
      trip_id,
      startDate,
      endDate,
      ratingInp,
      commentInp
    );

    req.session.user[1].map((element) => {
      if (element.trip_id === trip_id) {
        element.start_date = startDate;
        element.end_date = endDate;
        element.comment = commentInp;
        element.rating = ratingInp;
      }
    });

    return res.status(201).send(sentInfo);
  },
  editTrip: async (req, res) => {
    const { trip_id, start_date, end_date, rating, comment, file } = req.body;
    const db = req.app.get("db");

    const [tripUpdated] = await db.trips.edit_trip(
      trip_id,
      start_date,
      end_date,
      rating,
      comment,
      file
    );

    req.session.user[1].map((element) => {
      if (element.trip_id === trip_id) {
        element.start_date = start_date;
        element.end_date = end_date;
        element.comment = rating;
        element.rating = comment;
        element.file = file;
      }
    });

    return res.status(200).send(tripUpdated);
  },
  deleteTrip: async (req, res) => {
    const { id } = req.params;
    const db = req.app.get("db");

    await db.trips.delete_trip(id);

    let removeIndex = req.session.user[1]
      .map((item) => item.trip_id)
      .indexOf(+id);
    req.session.user[1].splice(removeIndex, 1);

    return res.sendStatus(200);
  },
  saveFile: async (req, res) => {
    const { url, trip_id } = req.body;
    const db = req.app.get("db");

    const [saved] = await db.trips.add_file(url, trip_id);

    req.session.user[1].map((element) => {
      if (element.trip_id === trip_id) {
        element.file = url;
      }
    });

    return res.status(200).send(saved);
  },
};
