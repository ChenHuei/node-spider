const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  getItems((items) => {
    res.json(items);
  });
});

function getItems(callback) {
  request(
    'https://www.ptt.cc/bbs/Tainan/M.1388172150.A.860.html',
    (err, res, body) => {
      const $ = cheerio.load(body, { decodeEntities: false });
      const items = [];

      $('div.push').each((index, obj) => {
        const seller = $(obj).find('.push-userid').html();
        const content = $(obj).find('.push-content').html().replace(': ', '');
        const time = $(obj).find('.push-ipdatetime').html().replace('\n', '');
        const last = items[items.length - 1];

        if (items.length > 0 && seller === last.seller) {
          last.content = last.content + content;
        } else {
          items.push({
            seller,
            content,
            time,
          });
        }
      });
      callback(items);
    }
  );
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
