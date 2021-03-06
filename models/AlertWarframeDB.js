/**
 * Created by lmangeat on 07/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AlertWarframe = new Schema({
    id: { type: Number, required: true},
    planet: { type: String, required: true},
    mission: { type: String, required: true},
    description: { type: String, required: true},
    duration: { type: Number, required: true},
    credits: { type: Number, required: true},
    reward: { type: String, required: false},
    begin: { type: Date, required: true},
    end: { type: Date, required: true},
    inserted_at: { type: Date, required: true}
});

AlertWarframe.methods.toString = function () {
    var result = this.mission + " (" + this.planet + "): " + this.description + " - " + this.duration + "m - " + this.credits + "cr";

    if(this. reward && this.reward != "")
        result += " - " + this.reward;

    return result;
};

exports.AlertWarframe = mongoose.model('AlertWarframe', AlertWarframe);