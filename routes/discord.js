var express = require('express');
var router = express.Router();

var Discord = require("discord.js");
var mongoose = require('mongoose');

var NewsWarframeDB = require('../models/NewsWarframeDB');
var NewsWarframe = mongoose.model('NewsWarframe');
var NewsDatesDB = require('../models/NewsDatesDB');
var NewsDates = mongoose.model('NewsDates');


var bot = null;

var sess;

/* GET home page. */
router.get('/boton', function(req, res, next) {
    if(bot != null)
        delete bot;

    bot = new Discord.Client();
    sess = req.session;

    bot.on("message", function(message){

        if( message.content.toLowerCase() === "avatar".toLowerCase() ){

            var usersAvatar = message.sender.avatarURL;

            if(usersAvatar){
                // user has an avatar
                bot.reply(message, "Vous pouvez trouver votre avatar ici: " + usersAvatar);
            }else{
                // user doesn't have an avatar
                bot.reply(message, "Vous n'avez pas d'avatar");
            }
        }
    });

    bot.on("ready", function(){
        /*var senMess = function(){
            bot.sendMessage("116119016891744259", "Message de test.");
        }
        senMess();*/
        newsWarframe();
        setInterval(newsWarframe, 24 * 60 * 60 * 1000);

        console.log('Bot ready !');
        sess.botReady = true;
        res.redirect('/');
    });

    bot.login("jagaimo.robot@gmail.com", "jagaimo-robot");
});

router.get('/botoff', function(req, res, next){
    bot.logout();

    bot.on("disconnected", function(){
        req.session.botReady = false;
        res.redirect('/');
    });
});

router.get('/testDates', function(req, res, next){
    var dates = NewsDates
        .$where('this.lasted_insert <= this.lasted_access')
        .exec(function(){
        });

    console.log(dates);
});

function newsWarframe(){
    var dates = NewsDates
                .$where('this.lasted_insert < this.lasted_access')
                .exec(function(){
                });

    console.log(dates);
    /*
    if(dates != ""){
        console.log(dates);
    }
    */
    //bot.sendMessage("116119016891744259", "https://warframe.com/fr/news/orokin-overload-weekend-now"); //#test: 116119016891744259     #Warframe: 101372893669130240
}


module.exports = router;
