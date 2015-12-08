/**
 * Created by lmangeat on 07/12/2015.
 */
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Twitter = require('twitter');

var AlertWarframeDB = require('../models/AlertWarframeDB');
var AlertWarframe = mongoose.model('AlertWarframe');

var alertRegExStr = /([a-zA-Z]*)\s\(([a-zA-Z]*)\):\s([^\-]*)\s-\s([0-9]*)m\s-\s([0-9]*)cr(.*)/;
//var alertRegExStr2 = /([a-zA-Z]*)\s\(([a-zA-Z]*)\)\s\|\s([a-zA-Z]*)\s\(([a-zA-Z]*)\)\s\|\s([a-zA-Z\(\)\s]*)\s\|\sStarts\sin\s([0-9]*)m\s\|\s([0-9]*)m\s\|\s([0-9,]*)cr(.*)/;

var clientTwitter = new Twitter({
    consumer_key: 'Edl4i579RJ6s5dAvDL0zUUm3r',
    consumer_secret: 'lD5dMlhiuLvS2p9V10cz8EziJSkr6znF8aXkuS0UtSAFfL0cLW',
    access_token_key: '610937782-5dCYHFgBvMX9Qz3LlKLMpBiLK3J0285fZn4XHp5c',
    access_token_secret: '9Qzi2ty2CNLiX2hZpdkJHzm29SBZGwGt4xzLnn9tHAdP8'
});

router.get('/getCurrentsAlerts', function(req, res, next){
    var params = {screen_name: 'WarframeAlerts', count: 5};
    clientTwitter.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            var id, planet, mission, description, duration, credits, reward, begin, end, inserted_at;
            var result = [];
            var arrMatches;
            var alertRegEx = new RegExp(alertRegExStr);
            for(var i = 0; i<tweets.length; i++){
                var tweet = tweets[i];
                if( (arrMatches = tweet.text.match(alertRegEx)) ) {
                    id = tweet.id;
                    planet = arrMatches[2];
                    mission = arrMatches[1];
                    description = arrMatches[3];
                    duration = parseInt(arrMatches[4]);
                    credits = parseInt(arrMatches[5]);
                    reward = (arrMatches[6]) ? arrMatches[6].substring(3) : "";
                    begin = new Date(tweet.created_at);
                    end = new Date(tweet.created_at);
                    end.setMinutes(end.getMinutes() + duration);

                    if(end > Date.now()){
                        result.push({
                            "id": id,
                            "planet": planet,
                            "mission": mission,
                            "description": description,
                            "duration": duration,
                            "credits": credits,
                            "reward": reward,
                            "begin": begin,
                            "end": end
                        });
                    }
                }
            }
            res.json(result);
        }
    });
});
/*
router.get('/getCurrentsAlerts2', function(req, res, next){
    var params = {screen_name: 'WFAlertsMods', count: 5};
    clientTwitter.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            var id, planet, mission, description, duration, credits, reward, begin, end, missionType, faction;
            var result = [];
            var arrMatches;
            var alertRegEx = new RegExp(alertRegExStr2);
            for(var i = 0; i<tweets.length; i++){
                var tweet = tweets[i];
                if( (arrMatches = tweet.text.match(alertRegEx)) ) {
                    console.log("------------------------------------------------");
                    id = tweet.id; console.log("id: " + id);
                    planet = arrMatches[2]; console.log("planet: " + planet);
                    mission = arrMatches[1]; console.log("mission: " + mission);
                    missionType = arrMatches[3]; console.log("missionType: " + missionType);
                    faction = arrMatches[4]; console.log("faction: " + faction);
                    description = arrMatches[5]; console.log("description: " + description);
                    duration = parseInt(arrMatches[7]); console.log("duration: " + duration);
                    credits = parseInt(arrMatches[8].replace(",", "")); console.log("credits: " + credits);
                    reward = (arrMatches[9]) ? arrMatches[9].substring(3) : ""; console.log("reward: " + reward);
                    begin = new Date(tweet.created_at);
                    begin.setMinutes(begin.getMinutes() + parseInt(arrMatches[6])); console.log("begin: " + begin);
                    end = new Date(tweet.created_at);
                    end.setMinutes(end.getMinutes() + duration); console.log("end: " + end);
                    console.log("------------------------------------------------");

                    if(end > Date.now()){
                        result.push({
                            "id": id,
                            "planet": planet,
                            "mission": mission,
                            "missionType": missionType,
                            "faction": faction,
                            "description": description,
                            "duration": duration,
                            "credits": credits,
                            "reward": reward,
                            "begin": begin,
                            "end": end
                        });
                    }
                }else{
                    result.push({"match": false});
                }
            }
            res.json(result);
        }
    });
});
*/
router.get('/testDates', function(req, res, next){
    var date = new Date("Mon Dec 07 10:12:02 +0000 2015");
    console.log(date);
    date.setMinutes(date.getMinutes()+50);
    console.log(date);
});

router.get('/scraperOn', function(req, res, next){
    scrapeAlertsWarframe();
    setInterval(scrapeAlertsWarframe, 60 * 1000); // [h *] [m *] [s *] ms (ici: 1min)

    req.session.scrapeAlertsWarframe = true;
    res.redirect('/');
});

function scrapeAlertsWarframe(){
    var params = {screen_name: 'WarframeAlerts', count: 5};
    clientTwitter.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            var id, planet, mission, description, duration, credits, reward, begin, end, inserted_at;
            var arrMatches;
            var alertRegEx = new RegExp(alertRegExStr);
            for(var i = 0; i<tweets.length; i++){
                var tweet = tweets[i];
                if( (arrMatches = tweet.text.match(alertRegEx)) ) {
                    id = tweet.id;
                    planet = arrMatches[2];
                    mission = arrMatches[1];
                    description = arrMatches[3];
                    duration = parseInt(arrMatches[4]);
                    credits = parseInt(arrMatches[5]);
                    reward = (arrMatches[6]) ? arrMatches[6].substring(3) : "";
                    begin = new Date(tweet.created_at);
                    end = new Date(tweet.created_at);
                    end.setMinutes(end.getMinutes() + duration);

                    createAlertWarframeIfNotExist(id, planet, mission, description, duration, credits, reward, begin, end);
                }
            }
        }
    });
}

function createAlertWarframeIfNotExist(id, planet, mission, description, duration, credits, reward, begin, end){
    AlertWarframe.find({ //Insertion uniquement si non pr?sent
        id: id
    }).exec(function(err, result){
        if (result == "") {
            var alert = new AlertWarframe({
                "id": id,
                "planet": planet,
                "mission": mission,
                "description": description,
                "duration": duration,
                "credits": credits,
                "reward": reward,
                "begin": begin,
                "end": end,
                "inserted_at": Date.now()
            });
            alert.save();
        }
    });
}

module.exports = router;