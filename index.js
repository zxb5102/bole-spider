var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio')
var url = "mongodb://localhost:27017/";
var other = require('./each.js');

var entryList = [];
var girlList = [];

// findAllEntry('http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%9D%AD%E5%B7%9E&kw=%E5%89%8D%E7%AB%AF');
function findAllEntry(url) {
    var req = http.get(url, (res) => {
        const { statusCode } = res;
        let error;
        if (statusCode !== 200) {
            console.log('error===>' + url + '===>code:' + statusCode);
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                entryList.push(rawData);
                console.log('开始收集第' + entryList.length + '页信息....');
                const $ = cheerio.load(rawData)
                $('#newlist_list_content_table table').each(function (i, ele) {
                    if (i != 0) {
                        var each = $(ele).find('.zwmc a').attr('href');
                        girlList.push(each);
                    }
                });
                console.log('已添加' + girlList.length + '条招聘信息');
                var next = $('a[class=next-page]').attr('href');
                if (next) {
                    findAllEntry(next);
                } else {
                    console.log('处理完毕');
                    var allLink = "";
                    for (girlLink of girlList) {
                        allLink += girlLink + '\r\n';
                    }
                    fs.writeFile("./a.txt", allLink, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("文件写入完毕");
                    });
                }
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error2: ${e.message}`);
    });
}
function getDetail(url) {
    var user = {
        url: url
    };
    var pro = new Promise(function (resolve, reject) {
        var req = http.get(url, (res) => {
            const { statusCode } = res;
            let error;
            if (statusCode !== 200) {
                console.log('error===>' + url + '===>code:' + statusCode);
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const $ = cheerio.load(rawData)
                    $('ul[class="terminal-ul clearfix"] li').each(function (i, ele) {
                        var value = $(ele).text();
                        user = other.extract(value, user);
                    });
                    var title = $('.top-fixed-box .fl h1').text();
                    user.title = title;
                    var company = $('.top-fixed-box .fl h2 a').text();
                    user.company = company;
                    var welfare = "";
                    $('.welfare-tab-box span').each(function (i, ele) {
                        welfare += $(ele).text()+",";
                    })//text();
                    user.welfare = welfare;
                    resolve(user);
                } catch (e) {
                    console.error("提取信息出错" + e.message);
                    reject(url);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error3: ${e.message}`);
            reject(url);
        }).on('socket', function (socket) {
            socket.setTimeout(5000);
            socket.on('timeout', function () {
                console.log('切断请求');
                req.abort();
                reject(url);
            });
        });
    });
    return pro;
}
getFromLocal();
function getFromLocal() {
    fs.readFile('a.txt', 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        }
        else {
            var ary = data.split('\r\n');
            girlList = ary;
            dealGirlList();
        }
    });
}
var girlObjAry = [];
var girlSize = 0;
var flag = true;
function dealGirlList() {
    // var dex = 0;
    // var errorList = [];
    new Promise(function (r, j) {
        for (var girl of girlList) {
            if (girl.trim() != '') {
                if (flag) {
                    girlSize++;
                }
                dealGirl(girl, r);
            }
            // if (girl.trim() != '') {
            //     getDetail(girl).then(function (user) {
            //         girlObjAry.push(user);
            //         r(girlObjAry);
            //     }).catch(function (error) {
            //     })
            // }
        }
    }).then(function (data) {
        // other.save(girlMsg);
        var per = (dealGirlSize / (dealGirlSize + errorGirlList.length) * 100);
        if (per == 100) {
            // debugger;
            console.log('开始写入数据库');
            other.save(girlObjAry);
        } else {
            console.log(per + '%');
            console.log('休息一下.....');
            flag = false;
            setTimeout(() => {
                girlList = errorGirlList.slice();
                errorGirlList = [];
                dealGirlList();
            }, 5000);
        }
    });
}
// var flag = true;
var dealGirlSize = 0;
var errorGirlList = [];
function dealGirl(girl, r) {
    getDetail(girl).then(function (user) {
        girlObjAry.push(user);
        console.log(girlObjAry.length + '         ' + errorGirlList.length + '        ' + girlSize);
        dealGirlSize++;
        if (girlObjAry.length + errorGirlList.length == girlSize) {
            console.log('所有处理完毕');
            r();
        }
    }).catch(function (egirl) {
        errorGirlList.push(egirl);
        console.log(girlObjAry.length + '         ' + errorGirlList.length + '        ' + girlSize);
        if (girlObjAry.length + errorGirlList.length == girlSize) {
            console.log('所有处理完毕');
            r();
        }
    })
}