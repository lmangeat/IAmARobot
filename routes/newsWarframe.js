/**
 * Created by lmangeat on 01/12/2015.
 */
var express = require('express');
var router = express.Router();

var Discord = require("discord.js");
var mongoose = require('mongoose');

var NewsWarframeDB = require('../models/NewsWarframeDB');
var NewsWarframe = mongoose.model('NewsWarframe');

router.get('/getAll', function(req, res, next){
    NewsWarframe.find().exec(function(res, news){
        res.json(news);
    });
});

router.get('/init', function(req, res, next){
    NewsWarframe.find().exec(function(res, news){
        res.json(news);
    });
});

module.exports = router;