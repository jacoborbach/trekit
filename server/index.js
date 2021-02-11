require('dotenv').config()
const massive = require('massive')
const express = require('express')
const session = require('express-session')
const authCtrl = require('./controllers/authCtrl')
const markerCtrl = require('./controllers/markerCtrl')
const userCtrl = require('./controllers/userCtrl')
const emailCtrl = require('./controllers/emailCtrl')
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env
const app = express()

// Aws------------------------------------>
const aws = require('aws-sdk')
const {
    S3_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
} = process.env

app.get('/sign-s3', (req, res) => {

    aws.config = {
        region: 'us-east-1',
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }

    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };

        return res.send(returnData)
    });
});

// End of Aws ---------------------------->


app.use(express.json())

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('db working')
})

//Auth handlers
app.post('/api/register', authCtrl.register)
app.post('/api/login', authCtrl.login)
app.get('/api/logout', authCtrl.logout)

//User handlers
app.get('/api/user/:id', userCtrl.getData)
app.get('/api/trip-count/:id', userCtrl.tripCount)


//trip handlers
app.post('/api/newtrip', markerCtrl.newtrip)
app.put('/api/trip/:id', markerCtrl.editTrip)
app.delete('/api/trip/:id', markerCtrl.deleteTrip)
app.post('/api/tripinfo/:id', markerCtrl.tripInfo)

//color
app.put('/api/color/:id', userCtrl.colorChange)

//Aws file
app.post('/api/file', markerCtrl.saveFile)


//Email handler
app.post('/api/email', emailCtrl.email);

app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))