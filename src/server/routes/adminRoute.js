var express = require('express');
var router = express.Router();
var admin = require('../models/admin');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var loggedIn = require("../config/superAdminAuthenticate").loggedIn;
var logged = require("../config/adminAuthenticate").loggedIn;


function encrypt(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(userPasswordInput, hashedPassword) {
    return bcrypt.compareSync(userPasswordInput, hashedPassword);
}

function createToken(user) {
    return jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "12h"
    });
}

router.get('/all', loggedIn, function(req, res) {
    admin.find({}, function(err, user) {
        if (err) {
            return res.json({ success: false, message: err });
        }
        if (user) {
            return res.json(user);
        }
    })
})

router.post('/login', function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.json({ success: false, message: "Username and Password are required to login" });
    }
    admin.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
            return res.json({ success: false, message: "Username incorrect!" });
        }
        if (err) {
            return res.json({ success: false, message: err })
        }
        if (user) {
            var verifyPassword = comparePassword(req.body.password, user.password);
            if (verifyPassword) {
                var token = createToken(user);
                return res.json({ success: true, message: "Login successful", token: token })
            } else {
                return res.json({ success: false, message: "Password Incorrect" })
            }
        }
    })
});


router.get('/getrole', logged, function(req, res) {
    var decoded = req.decoded._doc;
    for (var item in decoded) {
        if (decoded[item] === true) {
            return res.json({ Role: item });
        }
    }

})

router.post('/register', function(req, res) {
    if (!req.body.username && !req.body.password) {
        return res.json({ success: false, message: "Username and Password required to register!" });
    } else {
        admin.findOne({ username: req.body.username }, function(err, user) {
            if (user) {
                return res.json({ success: false, message: "Username already exists!" });
            } else if (err) {
                return res.json({ success: false, message: err });
            } else {
                if (req.body.isAnimeAdmin || req.body.isMovieAdmin || req.body.isGameAdmin ||
                    req.body.isCartoonAdmin || req.body.isSuperAdmin != true) {
                    return res.json({ success: false, message: "At least one Admin Role should be specified!" });
                }
                var newAdmin = new admin();
                newAdmin.username = req.body.username;
                newAdmin.password = encrypt(req.body.password);
                newAdmin.isAnimeAdmin = req.body.isAnimeAdmin || false;
                newAdmin.isMovieAdmin = req.body.isMovieAdmin || false;
                newAdmin.isGameAdmin = req.body.isGameAdmin || false;
                newAdmin.isCartoonAdmin = req.body.isCartoonAdmin || false;
                newAdmin.isSuperAdmin = req.body.isSuperAdmin || false;

                newAdmin.save(function(err, user) {
                    if (user) {
                        return res.json({ message: "Admin registered successfully!" });
                    }
                    if (err) {
                        return res.json({ message: err });
                    }
                })

            }
        })
    }
});

router.put('/update/:id', loggedIn, function(req, res) {
    var updateAdmin = new admin();
    admin.findOne({ _id: req.params.id }, function(err, foundadmin) {
        if (!admin) {
            return res.json({ message: "Admin ID Incorrect!" });
        }
        if (err) {
            return res.json({ message: err });
        }
        if (foundadmin) {
            updateAdmin.username = req.body.username || foundadmin.username;
            updateAdmin.password = encrypt(req.body.password) || foundadmin.password;
            updateAdmin.isAnimeAdmin = req.body.isAnimeAdmin || false;
            updateAdmin.isMovieAdmin = req.body.isMovieAdmin || false;
            updateAdmin.isGameAdmin = req.body.isGameAdmin || false;
            updateAdmin.isCartoonAdmin = req.body.isCartoonAdmin || false;
            updateAdmin.isSuperAdmin = req.body.isSuperAdmin || false;

            updateAdmin.save(function(err, updatedAdmin) {
                if (updatedAdmin) {
                    return res.json({ success: true, message: "Admin updated Successfullly" })
                }
                if (err) {
                    return res.json({ message: err });
                }
            })
        }
    });
})

var RouterDelete = router.delete('/delete/:id', loggedIn, function(req, res) {
    admin.findByIdAndRemove({ _id: req.params.id }, function(err, admin) {
        if (err) {
            return res.json({ message: err });
        }
        return res.json({ message: "Admin with username" + admin.username + "removed successfully" })
    })
});



module.exports = { router };