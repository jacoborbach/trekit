const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { first_name, last_name, email, password } = req.body
        const db = req.app.get('db')


        const [registeredUser] = await db.users.get_user(email)

        if (registeredUser) {
            return res.status(400).send('User already exists. Please sign in')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const createdUser = await db.users.create_user(first_name, last_name, email, hash)
        const userSesh = createdUser[0]

        req.session.user = userSesh
        return res.status(201).send(req.session.user)

    },
    login: async (req, res) => {
        const { email, password } = req.body
        const db = req.app.get('db')

        const [foundUser] = await db.users.get_user(email)
        if (!foundUser) {
            return res.status(400).send('Email not found')
        }

        const authenticated = bcrypt.compareSync(password, foundUser.password)
        if (!authenticated) {
            return res.status(401).send('Password is incorrect')
        }

        delete foundUser.password
        // console.log(foundUser)
        req.session.user = foundUser
        return res.status(202).send(req.session.user)

    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}