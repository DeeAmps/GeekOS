var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    title: { type: String, unique: true },
    image_src: String,
    upcoming: { type: Boolean, default: false },
    recommended: { type: Boolean, default: false },
    platforms: String,
    trailer_src: { type: String },
    rating: { type: Number },
    created_at: { type: Date, default: Date.now },
    reviews: [String]
})

var game = mongoose.model("Game", gameSchema);

module.exports = game;