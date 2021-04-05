module.exports = {
    search: async (req, res) => {
        const { textVal } = req.params
        const db = req.app.get('db')
        const results = await db.search.search(`${textVal}%`)
        return res.status(200).send(results)
    }
}