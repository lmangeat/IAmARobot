var express = require('express');
var router = express.Router();

var Discord = require("discord.js");
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

var NewsWarframeDB = require('../models/NewsWarframeDB');
var NewsWarframe = mongoose.model('NewsWarframe');

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

router.get('/testScrapper', function(req, res, next){
    res.json(newWarframeToJson());
});

function newsWarframe(){


    bot.sendMessage("116119016891744259", "https://warframe.com/fr/news/orokin-overload-weekend-now"); //#test: 116119016891744259     #Warframe: 101372893669130240
}

function newWarframeToJson(){
    var url = "https://warframe.com/fr";
    var json = [];
    request(url, function(error, result, html){
        if(!error){
            var $ = cheerio.load(html);
            var img_url, titre, link_url, content, date, category;
            var nbNews = 0;
            var news;

            $('.views-row', '.view-content').each(function(i, elem) {
                if($(elem).children().first().attr('class') != 'image'){
                    return;
                }
                img_url = $(elem).find($('img')).attr('src');
                link_url = "https://warframe.com" +  $(elem).find($('.image')).find($('a')).attr('href');
                titre = $(elem).find($('h2')).text();
                content = $(elem).find($('.body')).text();
                date = $(elem).find($('.date')).text();
                date = date.substring(0, date.length - 4);
                category = $(elem).find($('.category')).text();

                NewsWarframe.find({ //Insertion uniquement si non présent
                    link_url: link_url
                }).exec(function(err, result){
                    if (result == "") {
                        news = new NewsWarframe({
                            img_url: img_url,
                            link_url: link_url,
                            titre: titre,
                            content: content,
                            date: Date(date),
                            category: category
                        });
                        news.save();
                    }
                });
                setTimeout(function(){
                    console.log("attente 1s");
                }, 1000);
                return false;
                if(++nbNews == 10) return false;
            });
        }
    });
    return json;
}

module.exports = router;
