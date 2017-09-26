var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    title: { type: String, unique: true },
    image_src: String,
    trailer_src: String,
    showing: { type: Boolean, default: false },
    upcoming: { type: Boolean, default: false },
    rating: { type: Number },
    recommended: { type: Boolean, default: false },
    synosis: { type: String },
    released_date: { type: Date },
    created_at: { type: Date, default: Date.now },
    reviews: [String]
})

var movie = mongoose.model("Movie", movieSchema);

module.exports = movie;