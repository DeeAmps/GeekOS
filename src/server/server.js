//Load Node modules
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var passport = require('passport');
var path = require('path');
var jwt = require('jsonwebtoken');
var session = require('express-session');

//Routes
var adminRoute = require('./routes/adminRoute');
var animeRoute = require('./routes/animeRoute');
var gameRoute = require('./routes/gameRoute');
var movieRoute = require('./routes/movieRoute');
var cartoonRoute = require('./routes/cartoonRoute');


require('dotenv').config();

//Mongooose connection
mongoose.connect(process.env.DB_URL, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("In sync with Mongo DB");
})

//MiddleWares
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, "public")));


//Routing
app.use('/api/admin', adminRoute);
app.use('/api/anime', animeRoute);
app.use('/api/game', gameRoute);
app.use('/api/movie', movieRoute);
app.use('/api/cartoon', cartoonRoute);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    return res.json(err);
});

app.listen(process.env.PORT, function(err) {
    if (!err) console.log("Magic happens on port " + process.env.PORT + " ;)");
})