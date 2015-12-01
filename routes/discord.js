var express = require('express');
var router = express.Router();

var Discord = require("discord.js");
var request = require('request');
var cheerio = require('cheerio');
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
                if($(this).children().first().attr('class') != 'image'){
                    return;
                }
                img_url = $(this).find($('img')).attr('src');
                link_url = "https://warframe.com" +  $(this).find($('.image')).find($('a')).attr('href');
                titre = $(this).find($('h2')).text();
                content = $(this).find($('.body')).text();
                date = $(this).find($('.date')).text();
                date = date.substring(0, date.length - 4);
                category = $(this).find($('.category')).text();
                /*
                json.push({
                    img_url: img_url,
                    link_url: link_url,
                    titre: titre,
                    content: content,
                    date: date,
                    category: category
                });
                */
                news = {
                    img_url: img_url,
                    link_url: link_url,
                    titre: titre,
                    content: content,
                    date: date,
                    category: category
                };
                if(++nbNews == 10) return false;
            });
        }
    });
    return json;
}

module.exports = router;
