module.exports = {
    renderFriend: async (req, res) => {
        const { id } = req.params
        let db = req.app.get('db')

        //user 
        const [user] = await db.friends.get_friend(id)
        //count
        const count = await db.trips.count_trips(id)
        //markers
        const userData = await db.users.get_all_user_data(id)

        res.status(200).send([user, count, userData])
    }
}