var jwt = require("jsonwebtoken");
exports.loggedIn = function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.get('Authorization');

    if (token) {
        // verifies secret and checks exp
        var correctToken = token.split(" ");
        var firstTokenString = correctToken[0];
        if (firstTokenString == "geekOSBearer") {
            var realToken = correctToken[1];
            jwt.verify(realToken, process.env.SECRET_KEY, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token. Please provide a Correct Token!' });
                } else {
                    req.decoded = decoded;
                    if (decoded._doc.isSuperAdmin == true) {
                        next();
                    } else {
                        return res.status(403).json({ success: false, message: 'Sorry, you are unauthorised to this endpoint!' });
                    }

                }
            });
        } else {
            return res.json({ success: false, message: 'Incorrect Token Format' });
        }
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}