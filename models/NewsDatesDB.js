/**
 * Created by lmangeat on 01/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NewsDates = new Schema({
    lasted_insert: { type: Date, required: true},
    lasted_access: { type: Date, required: true}
});

exports.NewsDates = mongoose.model('NewsDates', NewsDates);