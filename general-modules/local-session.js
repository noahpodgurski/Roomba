require('dotenv').config()
module.exports = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}