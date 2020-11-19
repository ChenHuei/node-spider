const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const express = require('express');

const app = express();

app
  .get('/', function (req, res) {
    getTopPages((pages) => {
      async.map(
        pages,
        (page, callback) => {
          getPosts(page, (posts) => {
            callback(null, posts);
          });
        },
        (err, results) => {
          var posts = [].concat.apply([], results);
          async.map(
            posts,
            (post, callback) => {
              getImages(post, (images) => {
                callback(null, images);
              });
            },
            (err, results) => {
              var images = [].concat.apply([], results).map((image) => {
                return 'https://' + image + '.jpg';
              });
              res.json(images);
            }
          );
        }
      );
    });
  })
  .listen(3000);

function getTopPages(callback) {
  request('https://www.ptt.cc/bbs/Beauty/index.html', (err, res, body) => {
    var $ = cheerio.load(body);
    var prev = $('.btn-group-paging a').eq(1).attr('href').match(/\d+/)[0];
    callback(['', prev, prev - 1]);
  });
}

function getPosts(page, callback) {
  request(
    `https://www.ptt.cc/bbs/Beauty/index${page}.html`,
    (err, res, body) => {
      var $ = cheerio.load(body);
      var posts = $('.r-ent a')
        .map((index, obj) => {
          return $(obj).attr('href');
        })
        .get();
      callback(posts);
    }
  );
}

function getImages(post, callback) {
  request('https://www.ptt.cc' + post, (err, res, body) => {
    var images = body.match(/imgur.com\/[0-9a-zA-Z]{7}/g);
    images = [...new Set(images)];
    callback(images);
  });
}
