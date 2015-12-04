/**
 * Created by lmangeat on 18/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NewsWarframe = new Schema({

    img_url: { type: String, required: true},
    link_url: { type: String, required: true},
    titre: { type: String, required: true},
    content: { type: String, required: true},
    date: { type: Date, required: true},
    category: { type: String, required: true},
    inserted_at: { type: Date, required: true}
});

exports.NewsWarframe = mongoose.model('NewsWarframe', NewsWarframe);