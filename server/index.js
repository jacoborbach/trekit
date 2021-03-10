require('dotenv').config()
const massive = require('massive')
const express = require('express')
const session = require('express-session')
// const bodyParser = require('body')
const path = require('path')
const authCtrl = require('./controllers/authCtrl')
const markerCtrl = require('./controllers/markerCtrl')
const userCtrl = require('./controllers/userCtrl')
const emailCtrl = require('./controllers/emailCtrl')
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env
const app = express()


// Aws------------------------------------>
const aws = require('aws-sdk')
const { default: axios } = require('axios')
const {
    REACT_APP_S3_BUCKET,
    REACT_APP_AWS_ACCESS_KEY_ID,
    REACT_APP_AWS_SECRET_ACCESS_KEY
} = process.env

app.get('/sign-s3', (req, res) => {

    aws.config = {
        region: 'us-east-1',
        accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY
    }

    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: REACT_APP_S3_BUCKET,
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
            url: `https://${REACT_APP_S3_BUCKET}.s3.amazonaws.com/${fileName}`
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
app.put('/api/trip', markerCtrl.editTrip)
app.delete('/api/trip/:id', markerCtrl.deleteTrip)
app.post('/api/tripinfo', markerCtrl.tripInfo)
//app.put('/api/file', markerCtrl.deleteFile)  //deleteFile sets the value to null

//color
app.put('/api/changecolor', userCtrl.colorChange)

//Aws file
app.post('/api/file', markerCtrl.saveFile)

//Email handler
app.post('/api/email', emailCtrl.email);

//for hosting
app.use(express.static(__dirname + '/../build'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))