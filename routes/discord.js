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
        setInterval(newsWarframe, 5 * 60 * 1000);

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
    NewsDates.find().exec(function(err, tabDates){
        if(!err){
            var dates = tabDates[0];
            if(dates.lasted_access <= dates.lasted_insert){
                var lasted_access = dates.lasted_access;
                NewsWarframe
                    .where('inserted_at').gt(lasted_access)
                    .exec(function(err, tabNews){
                        for(var i = 0; i<tabNews.length; i++){
                            /*bot.sendFile("116119016891744259", tabNews[i].img_url, "Image Alerte WF", function(err, msg){
                                if(!err){
                                    bot.sendMessage("116119016891744259", tabNews[i].titre + tabNews[i].content + tabNews[i].link_url); //#test: 116119016891744259     #Warframe: 101372893669130240
                                }
                            });*/
                        }
                        res.send(tabNews[0].titre + "\n" + tabNews[0].content + "\n" + tabNews[0].link_url);
                        //res.json(news);
                    });
                //bot.sendMessage("116119016891744259", "https://warframe.com/fr/news/orokin-overload-weekend-now"); //#test: 116119016891744259     #Warframe: 101372893669130240
            }
        }
    });
});

function newsWarframe(){
    NewsDates.find().exec(function(err, tabDates){
        if(!err){
            var dates = tabDates[0];
            if(dates.lasted_access <= dates.lasted_insert){
                var lasted_access = dates.lasted_access;
                NewsWarframe
                .where('category').equals("PC")
                .where('inserted_at').gt(lasted_access)
                .exec(function(err, tabNews){
                    for(var i = 0; i<tabNews.length; i++){
                        /*bot.sendFile("116119016891744259", tabNews[i].img_url, "Image Alerte WF", function(err, msg){
                            if(!err){
                                bot.sendMessage("116119016891744259", tabNews[i].titre + tabNews[i].content + tabNews[i].link_url); //#test: 116119016891744259     #Warframe: 101372893669130240
                            }
                        });*/

                        bot.sendMessage("101372893669130240", tabNews[i].img_url + "\n\n\n" + tabNews[i].titre + "\n" + tabNews[i].content + "\n" + tabNews[i].link_url); //#test: 116119016891744259     #Warframe: 101372893669130240

                        NewsDates.update(
                            {},
                            {$set: {
                                lasted_access : Date.now()
                            }},
                            {multi: true}
                        ).exec(function(err){
                            if(err)
                                console.log(err);
                        });
                    }
                });
            }
        }
    });
}

module.exports = router;
