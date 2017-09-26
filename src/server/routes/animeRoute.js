var express = require('express');
var router = express.Router();
var anime = require('../models/anime');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var animeAdminloggedIn = require("../config/animeAuthenticate").loggedIn;

router.post('/', animeAdminloggedIn, function(req, res) {
    if (!req.body.title && !req.body.image_src && (!req.body.ongoing ||
            !req.body.completed) && !req.body.recommended && !req.body.synopsis &&
        !req.body.number_of_episodes) {
        return res.json({ message: "One or more fields were not specified" });
    }
    var newAnime = new anime();
    newAnime.title = req.body.title;
    newAnime.image_src = req.body.image_src;
    newAnime.ongoing = req.body.ongoing || false;
    newAnime.completed = req.body.completed || false;
    newAnime.recommended = req.body.recommended || false;
    newAnime.synopsis = req.body.synopsis;
    newAnime.number_of_episodes = req.body.number_of_episodes;
    newAnime.reviews = req.body.reviews || [];

    newAnime.save(function(err, anime) {
        if (anime) {
            return res.json({ message: "New Anime added successfully!" })
        }
        if (err) {
            return res.json({ message: err });
        }
    })
});

router.get('/all', function(req, res) {
    anime.find({}, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(anime);
    })
});

router.get('/ongoing', function(req, res) {
    anime.find({ ongoing: true }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(anime);
    });
});

router.get('/reviews/:id', function(req, res) {
    anime.findOne({ _id: req.params.id }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        if (anime) {
            return res.json(anime.reviews);
        }
    })
})

router.get('/completed', function(req, res) {
    anime.find({ completed: true }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(anime);
    });
});

router.get('/recommended', function(req, res) {
    anime.find({ recommended: true }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(anime);
    });
});

router.post('/review/:id', animeAdminloggedIn, function(req, res, next) {
    if (!req.body.review) {
        return res.json({ message: "Not reviewed" })
    }
    var review = req.body.review
    anime.findByIdAndUpdate({ _id: req.params.id }, { $push: { "reviews": review } }, { safe: true, upsert: true, new: true }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        if (!anime) {
            return res.json({ message: "Anime not found" });
        }
        if (anime) {
            return res.json({ message: "Review submitted succesfully!" })
        }
    })
});

router.delete('/delete/:id', animeAdminloggedIn, function(req, res) {
    anime.findByIdAndRemove({ _id: req.params.id }, function(err, anime) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json({ message: anime.title + "removed successfully" })
    })
});

router.put('/update/:id', animeAdminloggedIn, function(req, res) {
    anime.findOne({ _id: req.params.id }, function(err, foundanime) {
        if (!foundanime) {
            return res.json({ message: "Anime not Found!" });
        }
        if (err) {
            return res.json({ message: err });
        }
        if (foundanime) {
            updateAnime.title = req.body.title || foundanime.title;
            updateAnime.image_src = req.body.image_src || foundanime.image_src;
            updateAnime.ongoing = req.body.ongoing || foundanime.ongoing;
            updateAnime.completed = req.body.completed || foundanime.completed;;
            updateAnime.recommended = req.body.recommended || foundanime.recommended;;
            updateAnime.synopsis = req.body.synopsis || foundanime.synopsis;;
            updateAnime.number_of_episodes = req.body.number_of_episodes || foundanime.number_of_episodes;;

            updateAnime.save(function(err, updatedAnime) {
                if (updateAnime) {
                    return res.json({ success: true, message: "Anime updated Successfullly" })
                }
                if (err) {
                    return res.json({ message: err });
                }
            })
        }
    });

});

module.exports = router