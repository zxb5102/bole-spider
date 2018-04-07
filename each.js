var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio')
var url = "mongodb://localhost:27017/";

function extract(str) {
    var obj = {
        key: '',
        value: ''
    };
    if (str.indexOf('出生年月') > -1) {
        obj.value = str.replace('出生年月：', '');
        obj.key = 'birth';
    }
    return obj;
}

function save(objs) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("see");
        // var myobj = { name: "Company Inc", address: "Highway 37" };
        var coll = dbo.collection("user");
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
