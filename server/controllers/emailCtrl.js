// const nodemailer = require('nodemailer'),
//     { EMAIL, PASSWORD } = process.env;

// module.exports = {
//     email: async (req, res) => {
//         try {
//             let transporter = nodemailer.createTransport({
//                 host: 'smtp.gmail.com',
//                 port: 587,
//                 service: 'gmail',
//                 secure: false,
//                 requireTLS: true,
//                 auth: {
//                     user: EMAIL,
//                     pass: PASSWORD
//                 }
//             });
//             let info = await transporter.sendMail({
//                 from: `Jacob Orbach <${EMAIL}>`,
//                 to: 'jacoborbach96@gmail.com',
//                 subject: 'Nodemailer Test',
//                 //text is for plain text support if the html cannot load
//                 text: 'This is a NodeMailer Test',
//                 //Body of Email
//                 html: `<div>This is a NodeMailer Test</div>`
//             }, (err, res) => {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     res.status(200).send(info)
//                 }
//             })
//         } catch (err) {
//             res.status(500).send(err);
//         }
//     }
// }