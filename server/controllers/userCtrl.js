module.exports = {
    getData: async (req, res) => {
        const { id } = req.params
        // const { email } = req.body
        const db = req.app.get('db')

        const userData = await db.users.get_all_user_data(id)
        const count = await db.trips.count_trips(id)

        req.session.user = { ...req.session.user, userData, count }
        console.log(req.session.user)

        return res.status(200).send({ userData, count })
    },
    tripCount: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')

        const count = await db.trips.count_trips(id)

        req.session.user[2] = count

        return res.status(200).send(count)
    },
    colorChange: async (req, res) => {
        const { id, color } = req.body
        const db = req.app.get('db')

        const [changed] = await db.users.change_color(color, id)
        console.log('theme:', changed.theme)

        req.session.user[0].theme = changed.theme


        return res.status(200).send(changed)
    }
}