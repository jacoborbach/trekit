module.exports = {
    getData: async (req, res) => {
        const { id } = req.params
        // const { email } = req.body
        const db = req.app.get('db')

        const userData = await db.users.get_all_user_data(id)
        // const userData = await db.users.get_all_user_data(id) need to add this back to make it dynamic
        // console.log(userData)
        const count = await db.trips.count_trips(id)

        // console.log(userData)
        return res.status(200).send({ userData, count })
    },
    tripCount: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')

        const count = await db.trips.count_trips(id)
        return res.status(200).send(count)
    },
    colorChange: async (req, res) => {
        const { color } = req.body
        const { id } = req.params
        const db = req.app.get('db')
        // console.log(req.body)

        const [changed] = await db.users.change_color(color, id)

        return res.sendStatus(202)
    }
}