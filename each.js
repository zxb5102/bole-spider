var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio')
var url = "mongodb://localhost:27017/";

function extract(str, user) {
    var init = "职位月薪：#income,工作地点：#address,发布日期：#publishDate,工作性质：#category,工作经验：#experience,最低学历：#education,招聘人数：#requireNum,职位类别：#position"
    var ary = init.split(',');
    var rules = [];
    // debugger;
    for (var item of ary) {
        var rule = {};
        var each = item.split('#');
        rule.replaceStr = each[0];
        rule.field = each[1];
        rules.push(rule);
    }
    for (var item of rules) {
        var rep = item.replaceStr;
        var val = item.field;
        if (str.indexOf(rep) > -1) {
            user[val] = str.replace(rep, '');
        }
    }
    return user;
}

function save(objs) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("see");
        // var myobj = { name: "Company Inc", address: "Highway 37" };
        var coll = dbo.collection("work");
        dex = 0;
        for (item of objs) {
            coll.insertOne(item, function (err, res) {
                if (err) throw err;
                dex++;
                console.log("已插入" + dex + "条记录");
            });
        }
        db.close();
    });
}
module.exports = {
    extract,
    save
}
