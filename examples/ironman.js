const request = require('request');
const async = require('async');
const cheerio = require('cheerio');

const list = [
  'https://ithelp.ithome.com.tw/users/20107159/ironman/1325',
  'https://ithelp.ithome.com.tw/users/20107356/ironman/1315',
  'https://ithelp.ithome.com.tw/users/20107440/ironman/1355',
  'https://ithelp.ithome.com.tw/users/20107334/ironman/1335',
  'https://ithelp.ithome.com.tw/users/20107329/ironman/1286',
  'https://ithelp.ithome.com.tw/users/20091297/ironman/1330',
  'https://ithelp.ithome.com.tw/users/20075633/ironman/1375',
  'https://ithelp.ithome.com.tw/users/20107247/ironman/1312',
  'https://ithelp.ithome.com.tw/users/20107335/ironman/1337',
  'https://ithelp.ithome.com.tw/users/20106699/ironman/1283',
  'https://ithelp.ithome.com.tw/users/20107420/ironman/1381',
];

async.map(
  list,
  (url, callback) => {
    request(url, (err, res, body) => {
      const $ = cheerio.load(body);
      const link = url;
      const name = $('.profile-header__name').text().trim();
      const title = $('.qa-list__title--ironman')
        .text()
        .trim()
        .replace(' 系列', '');
      const joinDays = $('.qa-list__info--ironman span')
        .eq(0)
        .text()
        .replace(/[^0-9]/g, '');
      const posts = $('.qa-list__info--ironman span')
        .eq(1)
        .text()
        .replace(/[^0-9]/g, '');
      const subscriber = $('.qa-list__info--ironman span')
        .eq(2)
        .text()
        .replace(/[^0-9]/g, '');
      const postList = $('.qa-list')
        .map((index, obj) => {
          return {
            title: $(obj).find('.qa-list__title').text().trim(),
            like: $(obj).find('.qa-condition__count').eq(0).text().trim(),
            comment: $(obj).find('.qa-condition__count').eq(1).text().trim(),
            view: $(obj).find('.qa-condition__count').eq(2).text().trim(),
            date: $(obj).find('.qa-list__info-time').text().trim(),
            url: $(obj).find('.qa-list__title a').attr('href').trim(),
          };
        })
        .get();

      callback(null, {
        name,
        title,
        link,
        joinDays,
        posts,
        subscriber,
        postList,
      });
    });
  },
  (error, result) => console.log(result)
);
