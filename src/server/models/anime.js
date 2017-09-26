var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var animeSchema = new Schema({
    title: { type: String, unique: true },
    image_src: String,
    ongoing: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    recommended: { type: Boolean, default: false },
    synopsis: { type: String },
    number_of_episodes: { type: Number },
    created_at: { type: Date, default: Date.now },
    reviews: [String]
})

var anime = mongoose.model("Anime", animeSchema);

module.exports = anime;