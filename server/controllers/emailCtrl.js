const nodemailer = require('nodemailer'),
    { EMAIL, PASSWORD } = process.env;

module.exports = {
    email: async (req, res) => {
        const { email, first_name } = req.body;
        console.log(email)

        try {
            let transporter = nodemailer.createTransport({
                // host: 'smtp.gmail.com',
                // port: 587,
                service: 'gmail',
                // secure: false,
                // requireTLS: true,
                auth: {
                    user: EMAIL,
                    pass: PASSWORD
                }
            });
            let info = await transporter.sendMail({
                from: `Jacob Orbach <${EMAIL}>`,
                to: email,
                subject: 'Welcome to trekit!',
                //text is for plain text support if the html cannot load
                text: 'Welcome Email',
                //Body of Email
                html: `<h3>Welcome ${first_name}!</h3> <p>I hope you find this product useful. I have spent time trying to develop it to suit everyones needs. Please let me know if there are any issues or concerns.</p> <p>Best,</p><h4>Jacob Orbach</h4><p>(516) 880-4097</p>`
            }, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).send(info)
                }
            })
        } catch (err) {
            res.status(500).send(err);
        }
    }
}