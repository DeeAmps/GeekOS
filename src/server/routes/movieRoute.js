var express = require('express');
var router = express.Router();
var movie = require('../models/movie');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var movieAdminloggedIn = require("../config/movieAuthenticate").loggedIn;

router.post('/', movieAdminloggedIn, function(req, res) {
    if (!req.body.title && !req.body.image_src &&
        (!req.body.upcoming || (!req.body.showing && !req.body.rating) ||
            !req.body.recommended) && !req.body.trailer_src && !req.body.synopsis &&
        !req.body.released_date) {
        return res.json({ message: "One or more fields were not specified" });
    }
    var newMovie = new movie();
    newMovie.title = req.body.title;
    newMovie.image_src = req.body.image_src;
    newMovie.trailer_src = req.body.trailer_src;
    newMovie.showing = req.body.showing || false;
    newMovie.upcoming = req.body.upcoming || false;
    newMovie.rating = req.body.rating;
    newMovie.recommended = req.body.recommended || false;
    newMovie.synopsis = req.body.synopsis;
    newMovie.released_date = req.body.number_of_episodes;
    newMovie.reviews = req.body.reviews || [];

    newMovie.save(function(err, movie) {
        if (movie) {
            return res.json({ message: "New movie added successfully!" })
        }
        if (err) {
            return res.json({ message: err });
        }
    })
});

router.get('/all', function(req, res) {
    movie.find({}, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(movie);
    })
});

router.get('/showing', function(req, res) {
    movie.find({ showing: true }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(movie);
    });
});

router.get('/reviews/:id', function(req, res) {
    movie.findOne({ _id: req.params.id }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        if (movie) {
            return res.json(movie.reviews);
        }
    })
})

router.get('/upcoming', function(req, res) {
    movie.find({ upcoming: true }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(movie);
    });
});

router.get('/recommended', function(req, res) {
    movie.find({ recommended: true }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(movie);
    });
});

router.post('/review/:id', movieAdminloggedIn, function(req, res, next) {
    if (!req.body.review) {
        return res.json({ message: "Not reviewed" })
    }
    var review = req.body.review
    movie.findByIdAndUpdate({ _id: req.params.id }, { $push: { "reviews": review } }, { safe: true, upsert: true, new: true }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        if (!movie) {
            return res.json({ message: "movie not found" });
        }
        if (movie) {
            return res.json({ message: "Review submitted succesfully!" })
        }
    })
});

router.delete('/delete/:id', movieAdminloggedIn, function(req, res) {
    movie.findByIdAndRemove({ _id: req.params.id }, function(err, movie) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json({ message: movie.title + "removed successfully" })
    })
});

router.put('/update/:id', movieAdminloggedIn, function(req, res) {
    movie.findOne({ _id: req.params.id }, function(err, foundmovie) {
        if (!foundmovie) {
            return res.json({ message: "movie not Found!" });
        }
        if (err) {
            return res.json({ message: err });
        }
        if (foundmovie) {
            updatemovie.title = req.body.title || foundmovie.title;
            updatemovie.image_src = req.body.image_src || foundmovie.image_src;
            updatemovie.trailer_src = req.body.trailer_src || foundmovie.trailer_src;
            updatemovie.showing = req.body.showing || foundmovie.showing;
            updatemovie.upcoming = req.body.upcoming || foundmovie.upcoming;
            updatemovie.rating = req.body.rating || foundmovie.rating;
            updatemovie.recommended = req.body.recommended || foundmovie.recommended;
            updatemovie.synopsis = req.body.synopsis || foundmovie.synopsis;
            updatemovie.released_date = req.body.released_date || foundmovie.released_date;

            updatemovie.save(function(err, updatedmovie) {
                if (updatemovie) {
                    return res.json({ success: true, message: "Movie updated Successfullly" })
                }
                if (err) {
                    return res.json({ message: err });
                }
            })
        }
    });

});

module.exports = router