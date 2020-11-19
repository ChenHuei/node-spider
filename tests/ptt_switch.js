const request = require('request');
const cheerio = require('cheerio');

request('https://www.ptt.cc/bbs/NSwitch/index.html', (error, res, body) => {
  const $ = cheerio.load(body);

  const list = $('.r-ent a')
    .map((index, obj) => {
      return {
        title: $(obj).text(),
        link: $(obj).attr('href'),
        timestamp: $(obj).attr('href').substr(14, 10),
      };
    })
    .get();

  console.log(list);
});
