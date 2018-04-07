var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio')
var url = "mongodb://localhost:27017/";
var other = require('./each.js');

var entryList = [];
var girlList = [];

// findAllEntry('http://date.jobbole.com/');
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
                $('.list-posts li').each(function (i, ele) {
                    // debugger;
                    if (i != 0) {
                        var each = $(ele).find('.p-tit a').attr('href');
                        girlList.push(each);
                    } else {
                        console.log(11111111111111111111111);
                    }
                });
                console.log('已添加' + girlList.length + '位女生信息');
                var next = $('#pagination-next-page > a').attr('href');
                if (next) {
                    findAllEntry(next);
                }
                if (entryList.length == 20) {
                    // dealGirlList();
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
        console.error(`Got error: ${e.message}`);
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
                    $('.p-entry p').each(function (i, ele) {
                        var value = $(ele).text();
                        var result = other.extract(value);
                        switch (result.key) {
                            case 'birth':
                                user.birth = result.value;
                                break;
                        }
                    });
                    // return user;
                    resolve(user);
                } catch (e) {
                    console.error("提取信息出错" + e.message);
                    reject({
                        url: url
                    });
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject({
                url: url
            });
        }).on('socket', function (socket) {
            socket.setTimeout(5000);
            socket.on('timeout', function () {
                console.log('切断请求');
                req.abort();
                reject({
                    url: url
                });
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
function dealGirlList() {
    var girlMsg = [];
    var dex = 0;
    var errorList = [];
    new Promise(function (r, j) {
        var allSize = girlList.length;
        for (var girl of girlList) {
            if (girl.trim() != '') {
                getDetail(girl).then(function (user) {
                    girlMsg.push(user);
                    console.log('已经收集第' + (dex++) + '个女生的数据');
                    var errorSize = errorList.length
                    var successSize = girlMsg.length
                    console.log('还差' + (allSize - errorSize - successSize));
                    if (errorSize + successSize == allSize) {
                        console.log('舍弃' + errorSize + '条记录');
                        console.log('可用' + successSize + '条记录');
                        r(girlMsg);
                    }
                }).catch(function (error) {
                    console.log('重新记录-----》' + error.url);
                    errorList.push(error.url);
                    var errorSize = errorList.length
                    var successSize = girlMsg.length
                    console.log('还差' + (allSize - errorSize - successSize));
                    if (errorSize + successSize == allSize) {
                        console.log('舍弃' + errorSize + '条记录');
                        console.log('可用' + successSize + '条记录');
                        console.log('2s后开启下一轮');
                        setTimeout(function () {
                            girlList = ary;
                            dealGirlList();
                        }, 2000)
                        r(girlMsg);
                    }
                })
            } else {
                allSize--;
            }
        }
    }).then(function (data) {
        debugger;
        // other.save(girlMsg);
    });
}

// other.save([{ birth: 'fjdskl' },{ birth: 'fjdsfdksfjslfkl' }]);