/**
 * Created by lmangeat on 18/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({

    img_url: { type: String, required: true},
    link_url: { type: String, required: true},
    titre: { type: String, required: true},
    content: { type: String, required: true},
    date: { type: Date, required: true},
    category: { type: String, required: true}
});

User.pre('save', function (next) {
    var thisUrl = this.link_url;
    User.find({
        link_url: thisUrl
    }).exec(function(err, result){
        if (result == "") {
            next();
        }
    });
});