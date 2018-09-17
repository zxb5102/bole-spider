var Crawler = require("crawler");
var fs = require("fs");

var hasTotalNumber = false;
var totalNumber = 0;
var isDeal = false;
var resultData = {
  data: { results: [] }
};
var pageSize = 100;
var sourceUrl = `https://fe-api.zhaopin.com/c/i/sou?pageSize=${pageSize}&cityId=653&salary=8001,10000&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kw=web%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88&kt=3&lastUrlQuery=%7B%22pageSize%22:%2260%22,%22jl%22:%22653%22,%22sf%22:%228001%22,%22st%22:%2210000%22,%22kw%22:%22web%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%22,%22kt%22:%223%22,%22%22:%228001%22%7D&=8001`;
//start=0&
var c = new Crawler({
  jQuery: false,
  maxConnections: 10,
  headers: {
    // xm:'xiaoming'
    cookie:
      "adfbid2=0; sts_deviceid=165bd12ec92c-0c555db10b9c1c-3b4a5a67-1440000-165bd12ec94143; _jzqckmp=1; dywez=95841923.1536494235.2.2.dywecsr=other|dyweccn=121113803|dywecmd=cnt|dywectr=%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98; __utma=269921210.56659558.1536475459.1536475459.1536494235.2; __utmz=269921210.1536494235.2.2.utmcsr=other|utmccn=121113803|utmcmd=cnt|utmctr=%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98; lastchannelurl=https%3A//passport.zhaopin.com/login; firstchannelurl=https%3A//passport.zhaopin.com/login%3Fy7bRbP%3DdplZr2JsVTJsVTJsScnqX.YJ0IIGeT_DODSXBHPcW2W; dywem=95841923.y; adfbid=0; dywea=95841923.4580253770585167400.1536475458.1536494235.1536498854.3; dywec=95841923; sts_sg=1; sts_sid=165be77e8ca2b3-03580b42e72179-3b4a5a67-1440000-165be77e8cb2c3; __utmc=269921210; Hm_lvt_80e552e101e24fe607597e5f45c8d2a2=1536494470,1536494811,1536496795,1536498854; __utmt=1; hiddenEpinDiv=none; BLACKSTRIP=yes; ZP_OLD_FLAG=false; __xsptplusUT_30=1; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1536475459,1536494235,1536501664,1536501903; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1536501903; zp_src_url=https%3A%2F%2Fsp0.baidu.com%2F9q9JcDHa2gU2pMbgoY3K%2Fadrc.php%3Ft%3D06KL00c00fAhw9s0gHFI0KqiAsaF2FNU000005WhvNb00000Yl7zX1.THLyktAJdIjA80K85yF9pywdpAqVuNqsusK15ywBmhPhPWw9nj0smWPBmHT0IHYzfWT3rDf4PDFjfbfsnYDLPHD3wHPKPYmLnDcsnDR3fsK95gTqFhdWpyfqn1DYnjf3P1ndPBusThqbpyfqnHm0uHdCIZwsT1CEQLILIz4lpA7ETA-8QhPEUHq1pyfqnHcknHD1rj01FMPGIARqTZGlpZNBpy7EIAb0mLFW5HmsP1fs%26tpl%3Dtpl_11535_17772_13457%26l%3D1507452664%26attach%3Dlocation%253D%2526linkName%253D%2525E6%2525A0%252587%2525E5%252587%252586%2525E5%2525A4%2525B4%2525E9%252583%2525A8-%2525E6%2525A0%252587%2525E9%2525A2%252598-%2525E4%2525B8%2525BB%2525E6%2525A0%252587%2525E9%2525A2%252598%2526linkText%253D%2525E3%252580%252590%2525E6%252599%2525BA%2525E8%252581%252594%2525E6%25258B%25259B%2525E8%252581%252598%2525E3%252580%252591%2525E5%2525AE%252598%2525E6%252596%2525B9%2525E7%2525BD%252591%2525E7%2525AB%252599%252520%2525E2%252580%252593%252520%2525E5%2525A5%2525BD%2525E5%2525B7%2525A5%2525E4%2525BD%25259C%2525EF%2525BC%25258C%2525E4%2525B8%25258A%2525E6%252599%2525BA%2525E8%252581%252594%2525E6%25258B%25259B%2525E8%252581%252598%2525EF%2525BC%252581%2526xp%253Did(%252522m3140487356_canvas%252522)%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FH2%25255B1%25255D%25252FA%25255B1%25255D%2526linkType%253D%2526checksum%253D171%26wd%3D%25E6%2599%25BA%25E8%2581%2594%25E6%258B%259B%25E8%2581%2598%26issp%3D1%26f%3D8%26ie%3Dutf-8%26rqlang%3Dcn%26tn%3Dbaiduhome_pg%26inputT%3D2040; __xsptplus30=30.3.1536501903.1536501903.1%231%7Cother%7Ccnt%7C121113803%7C%7C%23%23jxFmyrn_4UwGlrM-OEcJwTaY6SEzXa3Q%23; _jzqa=1.1744785975916268800.1536475459.1536494235.1536501904.3; _jzqc=1; _jzqy=1.1536475459.1536501904.1.jzqsr=baidu|jzqct=%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98.-; qrcodekey=661b1ba0a1f9485eabfa40056d60d0f0; _jzqb=1.2.10.1536501904.1; JsNewlogin=2010723266; JSloginnamecookie=13684870424; JSShowname=%E9%92%9F%E6%9D%8F%E5%BD%AC; at=75316f55109d489d841f8ce52e1bfd1f; Token=75316f55109d489d841f8ce52e1bfd1f; rt=64087516bb014637a173fd405a12a472; JSsUserInfo=386b2e695671416558700569476d5f6a586b41775d6f48355275216b2469567146655c7003694d6d5f6a516b4677556f44355b75596b51693e7139655270aafd3a0a0735526b3477286f4d3558755c6b5f695d71426556700169476d596a586b3177146f013547750e6b056906714c653c706169486d5a6a526b3077316f4d355175406b5a694b7145655d700f69406d506a286b3d77586f40355275386b2b6956713d6522700269456d596a5d6b4077556f483551755e6b51693e712365527004694e6d386a206b4c77506f403559755c6b5a695e714e6554706069256d256a546b4077546f45355f75586b53695f7145655d700469356d1a6a186b5f77066f1f350475566b9; uiioit=3d752c6452695d6a033557645a755c645e695b6a0c355f6453752a642b69566a04355c641; LastCity=%E5%8D%97%E6%98%8C; LastCity%5Fid=691; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; ZL_REPORT_GLOBAL={%22//jobs%22:{%22actionid%22:%22d3e05947-abbd-4b2a-84e1-97504f46e6c9-jobs%22%2C%22funczone%22:%22dtl_best_for_you%22}%2C%22//i%22:{%22actionid%22:%2262a0f09f-c147-47df-a17f-376a4b2c9dd4-i%22%2C%22funczone%22:%22njd_for_you%22}}; dyweb=95841923.17.10.1536498854; __utmb=269921210.36.10.1536494235; sts_evtseq=17; Hm_lpvt_80e552e101e24fe607597e5f45c8d2a2=1536501961; referrerUrl=; stayTimeCookie=1536501961322; loginreleased=1"
  },
  // This will be called for each crawled page
  callback: function (error, res, done) {
    // var {statusCode,headers,request,body} = res;
    if (error) {
      console.log(error);
    } else {
      if (!hasTotalNumber) {
        totalNumber = JSON.parse(res.body).data.numFound;
        hasTotalNumber = true;
        c.queue(sourceUrl);
      } else if (!isDeal) {
        isDeal = true;
        var pageCount = Math.ceil(totalNumber / pageSize);
        for (var i = 0; i < pageCount; i++) {
          var start = i * pageSize;
          c.queue(`${sourceUrl}&start=${start}`);
        }
      } else {
        // var $ = res.$;
        var resultBody = JSON.parse(res.body);
        // resultData.data.results = resultData.data.results.concat(resultBody.data.results);
        resultData.data.results.push(...resultBody.data.results);
        // console.log;
        if (resultData.data.results.length == totalNumber) {
          fs.writeFile("./a.json", JSON.stringify(resultData), function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("文件写入完毕");
          });
        }
      }
    }
    done();
  }.bind(this)
});
c.queue(sourceUrl);
