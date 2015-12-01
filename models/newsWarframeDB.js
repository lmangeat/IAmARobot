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
    category: { type: String, required: true}
});

NewsWarframe.pre('save', function (next) {
    var thisUrl = this.link_url;
    NewsWarframe.find({
        link_url: thisUrl
    }).exec(function(err, result){
        if (result == "") {
            next();
        }
    });
});

exports.NewsWarframe = mongoose.model('NewsWarframe', NewsWarframe);