/**
 * Created by lmangeat on 07/12/2015.
 */
var express = require('express');
var router = express.Router();

var Twitter = require('twitter');

var alertRegEx = "([a-zA-Z]*) \(([a-zA-Z]*)\): ([^\-]*) - ([0-9]*)m - ([0-9]*)cr(.*)";

router.get('/testTwitter', function(req, res, next){
    var client = new Twitter({
        consumer_key: 'Edl4i579RJ6s5dAvDL0zUUm3r',
        consumer_secret: 'lD5dMlhiuLvS2p9V10cz8EziJSkr6znF8aXkuS0UtSAFfL0cLW',
        access_token_key: '610937782-5dCYHFgBvMX9Qz3LlKLMpBiLK3J0285fZn4XHp5c',
        access_token_secret: '9Qzi2ty2CNLiX2hZpdkJHzm29SBZGwGt4xzLnn9tHAdP8'
    });

    var params = {screen_name: 'WarframeAlerts', count: 5};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            res.json(tweets);
        }
    });
});

router.get('/testDates', function(req, res, next){
    var date = new Date("Mon Dec 07 10:12:02 +0000 2015");
    console.log(date);
    date.setMinutes(date.getMinutes()+50);
    console.log(date);
});

module.exports = router;