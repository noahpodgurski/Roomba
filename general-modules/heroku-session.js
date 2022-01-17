require('dotenv').config()
// var RedisStore = require('connect-redis')(session);
// var redisURL = url.parse(process.env.REDISCLOUD_URL);
// var redisClient = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });
// redisClient.auth(redisURL.auth.split(":")[1]);
// console.log("Checking the redis url - - " + process.env.REDISCLOUD_URL);
// console.log("Checking the actual redis url variable - - " + redisURL);

// var redisOptions = {
//     client: redisClient,
//     host: redisURL.hostname,
//     port: redisURL.port,
//     url: redisURL
// }
// console.log(redisOptions)

module.exports = {
    // store: new RedisStore(redisOptions),
    cookie : {secure : true},
    // cookie: {
    //     domain: process.env.DOMAIN,
    //     secure : true
    // },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};


