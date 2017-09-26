var express = require('express');
var router = express.Router();
var cartoon = require('../models/cartoon');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var cartoonAdminloggedIn = require("../config/cartoonAuthenticate").loggedIn;

router.post('/', cartoonAdminloggedIn, function(req, res) {
    if (!req.body.title && !req.body.image_src && (!req.body.ongoing ||
            !req.body.completed) && !req.body.recommended && !req.body.synopsis &&
        !req.body.number_of_episodes) {
        return res.json({ message: "One or more fields were not specified" });
    }
    var newCartoon = new cartoon();
    newCartoon.title = req.body.title;
    newCartoon.image_src = req.body.image_src;
    newCartoon.ongoing = req.body.ongoing || false;
    newCartoon.completed = req.body.completed || false;
    newCartoon.recommended = req.body.recommended || false;
    newCartoon.synopsis = req.body.synopsis;
    newCartoon.number_of_episodes = req.body.number_of_episodes;
    newCartoon.reviews = req.body.reviews || [];

    newAnime.save(function(err, cartoon) {
        if (cartoon) {
            return res.json({ message: "New Cartoon added successfully!" })
        }
        if (err) {
            return res.json({ message: err });
        }
    })
});

router.get('/all', function(req, res) {
    cartoon.find({}, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(cartoon);
    })
});

router.get('/ongoing', function(req, res) {
    cartoon.find({ ongoing: true }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(cartoon);
    });
});

router.get('/reviews/:id', function(req, res) {
    cartoon.findOne({ _id: req.params.id }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        if (cartoon) {
            return res.json(cartoon.reviews);
        }
    })
})

router.get('/completed', function(req, res) {
    cartoon.find({ completed: true }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(cartoon);
    });
});

router.get('/recommended', function(req, res) {
    cartoon.find({ recommended: true }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json(cartoon);
    });
});

router.post('/review/:id', cartoonAdminloggedIn, function(req, res, next) {
    if (!req.body.review) {
        return res.json({ message: "Not reviewed" })
    }
    var review = req.body.review
    cartoon.findByIdAndUpdate({ _id: req.params.id }, { $push: { "reviews": review } }, { safe: true, upsert: true, new: true }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        if (!cartoon) {
            return res.json({ message: "Cartoon not found" });
        }
        if (cartoon) {
            return res.json({ message: "Review submitted succesfully!" })
        }
    })
});

router.delete('/delete/:id', cartoonAdminloggedIn, function(req, res) {
    cartoon.findByIdAndRemove({ _id: req.params.id }, function(err, cartoon) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json({ message: cartoon.title + "removed successfully" })
    })
});

router.put('/update/:id', cartoonAdminloggedIn, function(req, res) {
    cartoon.findOne({ _id: req.params.id }, function(err, foundcartoon) {
        if (!foundcartoon) {
            return res.json({ message: "Cartoon not Found!" });
        }
        if (err) {
            return res.json({ message: err });
        }
        if (foundcartoon) {
            updateCartoon.title = req.body.title || foundcartoon.title;
            updateCartoon.image_src = req.body.image_src || foundcartoon.image_src;
            updateCartoon.ongoing = req.body.ongoing || foundcartoon.ongoing;
            updateCartoon.completed = req.body.completed || foundcartoon.completed;;
            updateCartoon.recommended = req.body.recommended || foundcartoon.recommended;;
            updateCartoon.synopsis = req.body.synopsis || foundcartoon.synopsis;;
            updateCartoon.number_of_episodes = req.body.number_of_episodes || foundcartoon.number_of_episodes;;

            updateCartoon.save(function(err, updateCartoon) {
                if (updateCartoon) {
                    return res.json({ success: true, message: "Cartoon updated Successfullly" })
                }
                if (err) {
                    return res.json({ message: err });
                }
            })
        }
    });

});

module.exports = router