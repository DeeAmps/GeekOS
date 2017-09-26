var express = require('express');
var router = express.Router();
var game = require('../models/game');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var gameAdminloggedIn = require("../config/gameAuthenticate").loggedIn;

router.post('/', gameAdminloggedIn, function(req, res) {
    if (!req.body.title && !req.body.image_src && !req.body.trailer_src &&
        !req.body.rating && !req.body.platforms) {
        return res.json({ message: "One or more fields were not specified" });
    }
    var newGame = new game();
    newGame.title = req.body.title;
    newGame.image_src = req.body.image_src;
    newGame.upcoming = req.body.upcoming || false;
    newGame.trailer_src = req.body.trailer_src;
    newGame.recommended = req.body.recommended || false;
    newGame.platforms = req.body.platforms;
    newGame.rating = req.body.rating;
    newGame.reviews = req.body.reviews || [];

    newGame.save(function(err, game) {
        if (game) {
            return res.json({ message: "New Game added successfully!" })
        }
        if (err) {
            return res.json({ message: err });
        }
    })
});

router.get('/all', function(req, res) {
    game.find({}, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(game);
    })
});

router.get('/upcoming', function(req, res) {
    game.find({ upcoming: true }, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(game);
    });
});

router.get('/reviews/:id', function(req, res) {
    game.findOne({ _id: req.params.id }, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        if (game) {
            return res.json(game.reviews);
        }
    })
});

router.get('/recommended', function(req, res) {
    game.find({ recommended: true }, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(game);
    });
});

router.post('/review/:id', gameAdminloggedIn, function(req, res, next) {
    if (!req.body.review) {
        return res.json({ message: "Not reviewed" })
    }
    var review = req.body.review
    game.findByIdAndUpdate({ _id: req.params.id }, { $push: { "reviews": review } }, { safe: true, upsert: true, new: true }, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        if (!game) {
            return res.json({ message: "Game not found" });
        }
        if (game) {
            return res.json({ message: "Review submitted succesfully!" })
        }
    })
});

router.delete('/delete/:id', gameAdminloggedIn, function(req, res) {
    game.findByIdAndRemove({ _id: req.params.id }, function(err, game) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json({ message: game.title + "removed successfully" })
    })
});

router.put('/update/:id', gameAdminloggedIn, function(req, res) {
    game.findOne({ _id: req.params.id }, function(err, foundgame) {
        if (!foundgame) {
            return res.json({ message: "Game not Found!" });
        }
        if (err) {
            return res.json({ message: err });
        }
        if (foundgame) {
            updateGame.title = req.body.title || foundgame.title;
            updateGame.image_src = req.body.image_src || foundgame.image_src;
            updateGame.upcoming = req.body.upcoming || foundgame.upcoming;
            updateGame.trailer_src = req.body.completed || foundgame.completed;;
            updateGame.recommended = req.body.recommended || foundgame.recommended;;
            updateGame.platforms = req.body.platforms || foundgame.platforms;;
            updateGame.rating = req.body.rating || foundgame.rating;;

            updateGame.save(function(err, updatedGame) {
                if (updatedGame) {
                    return res.json({ success: true, message: "Game updated Successfullly" })
                }
                if (err) {
                    return res.json({ message: err });
                }
            })
        }
    });

});

module.exports = router