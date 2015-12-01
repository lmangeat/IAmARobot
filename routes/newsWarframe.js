/**
 * Created by lmangeat on 01/12/2015.
 */
var express = require('express');
var router = express.Router();

var Discord = require("discord.js");
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var NewsWarframeDB = require('../models/NewsWarframeDB');
var NewsWarframe = mongoose.model('NewsWarframe');

router.get('/getAll', function(req, res, next){
    NewsWarframe.find().exec(function(err, news){
        res.json(news);
    });
});

router.get('/testScrapper', function(req, res, next){
    res.json(scrappNewsWarframe());
});

router.get('/scrapperOn', function(req, res, next){
    scrappNewsWarframe();
    setInterval(scrappNewsWarframe, 5 * 60 * 1000); // [h *] [m *] [s *] ms (ici: 5min)

    req.session.scrappNewsWarframe = true;
    res.redirect('/');
});

function scrappNewsWarframe(){
    var url = "https://warframe.com/fr";
    request(url, function(error, result, html){
        if(!error){
            var $ = cheerio.load(html);
            var img_url, titre, link_url, content, date, category;
            var nbNews = 0;

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

                createNewsWarframeIfNotExist(img_url, link_url, titre, content, date, category);

                //return false;
                if(++nbNews == 10) return false; //Requete sur 10 entrées uniquement (perf)
            });
        }
    });
    return {finished: true};
}

function createNewsWarframeIfNotExist(img_url, link_url, titre, content, date, category){
    NewsWarframe.find({ //Insertion uniquement si non présent
        link_url: link_url
    }).exec(function(err, result){
        if (result == "") {
            var news = new NewsWarframe({
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
}

module.exports = router;