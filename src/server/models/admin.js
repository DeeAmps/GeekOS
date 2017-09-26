var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    isAnimeAdmin: { type: Boolean, default: false },
    isMovieAdmin: { type: Boolean, default: false },
    isGameAdmin: { type: Boolean, default: false },
    isCartoonAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
})

var adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;