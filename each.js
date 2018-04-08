var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio')
var url = "mongodb://localhost:27017/";

function extract(str,user) {
    // var obj = {
    //     key: '',
    //     value: ''
    // };
    var ary = str.split('\n');
    var birthStr = '出生年月：';
    var heightStr = '身高：';
    var incomeStr = '收入描述：'
    var educationStr = '学历：'
    // user.birth = user.height = user.income = user.education = '';
    for (var item of ary) {
        if (item.indexOf(birthStr) > -1) {
            user.birth = item.replace(birthStr, '');
            // obj.key = 'birth';
        }else if(item.indexOf(heightStr) > -1){
            user.height = item.replace(heightStr, '');
        }else if(item.indexOf(incomeStr) > -1){
            user.income = item.replace(incomeStr,'');
        }else if(item.indexOf(educationStr) > -1){
            user.education = item.replace(educationStr,'');
        }
    }
    return user;
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
