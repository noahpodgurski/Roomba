// const { default: sslRedirect } = require('heroku-ssl-redirect');

require('dotenv').config()
var express     = require("express"),
    app         = express(),
    fs          = require("fs");


    
app.set("view engine", "ejs");
// app.use(sslRedirect());
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("index", {
        // files: files
    });
})

console.log(process.env.CURRENT_ENVIRONMENT)
if(process.env.CURRENT_ENVIRONMENT === 'local'){
   sess = require('./general-modules/local-session.js')
   console.log('local session')
} else {
   sess = require('./general-modules/heroku-session.js')
   console.log('heroku session')
  app.use(function(req, res, next) {
    if ((req.get('X-Forwarded-Proto') !== 'https')) {
      res.redirect('https://' + req.get('Host') + req.url);
    } else
      next();
  });
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server Online.');
});
