const request = require('request');
const async = require('async');
const cheerio = require('cheerio');

function getStores(areas, callback) {
  async.mapSeries(
    areas,
    (area, callback) => {
      const data = Object.keys(area)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(area[key])}`
        )
        .join('&')
        .replace('%20%20', '++');

      const option = {
        url: 'https://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: data,
      };

      request(option, (error, res, body) => {
        const $ = cheerio.load(body);

        console.log($);

        const stores = $('.tableD tr')
          .map((_, obj) => {
            return {
              city: $(obj).find('td').eq(0).text(),
              area: $(obj).find('td').eq(1).text(),
              address: $(obj).find('td').eq(2).text(),
              store: $(obj).find('td').eq(3).text(),
            };
          })
          .get();
        stores.shift();
        callback(null, stores);
      });
    },
    (error, result) => {
      callback([].concat.apply([], result));
    }
  );
}

function getAreas(callback) {
  const cities = new Array(25).fill(0).map((_, index) => index + 1);

  async.map(
    cities,
    (city, callback) => {
      const option = {
        url: 'https://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
        method: 'POST',
        form: {
          __VIEWSTATE:
            'DFGh/9pCFknJyRC/Tkzsu1CIEv7BfCyKEWBH3dELF1Z8mFXMLjmTqabFpNyk0lEoIzrUN9WtfxLpZsw1FZjEsMoU3ZrDyxlxoRWoCxUoSe49l9scIv+3beJftaJQBqPhLfhxSaGG07jrPtUuyE+At6GjiOyhqUaa9YzTKAU40gH4eo2t0vTIpYnPsa1XOj4sfnLOgBkGBfs43haLGvQmAoUCXY15qtn2XivrwenGlmbcktQ4aOcdMR9WbpBjbh3zK2XFRrrxgvDOuBZKq9eHIhyqx1tUDxKMDnPCGFxJ1CBwqvaYXaABSorFZRms3edQCyntp8nQ6if4eY9i4mQ38WFV6gSr0LLGlRKjSGWAG9rYfJvMa9ihncrCHJpJOH3PuimQjnJKX6nzUxmsoRLvY53fAgyAzvlQnn8bEmHec219DXEGOuvAQibBcaUrw5hDrvauucsuOarDLTEnxb40mkk5S7vXWlP6Pts6BWLwmUHly90sfAFOTH6B/hLKgaPtUTUx8sRTIbUroixrFnuYyl3Yf3zMSE0vhC3lWskttRTgUe+I9bbELjj2kFETTONFn4BxIPRdQW0ATjQ4ikxkqd7d6U7S2J8P9sfVo4GsOuRWx7SNwFuQA1lC3tjmvX6kb90mm5Y8nZoX46fiEuhmRJ0Kjrz67tyycirg2tG8hmTmfYcLuZe6p+wY1KZP4jBu2Vw5JvoqQjSaAZKgGCnnaqACx7URfRmf88umSc7wMBT6uUjgHiswbMcyug4OtfeKEMad8WXZzR/fdHQiw2t8mHY0xzFUbn9hn9ragTWZCP5TF2fAk5UkMy7Ed5e+vYq1UaDDA2yMz4LosalgzgbXH4wxkh+8TxBlVPbEKLS7NAlwXSje3OYgVZqL3MyUxURfjblAlYd3gumOonA3hI9k8WoD61QaySrYIbCwcqcKWbmbWm1bYTieTmWA7TuxyvB12MNj2GAyVUH5iYoIRKFxbOM5fbhpTDbqY/TcVYyWguSQVPBAbNLKVyG56hkZ2gClwDrlXA==',
          __EVENTVALIDATION:
            '1u1RQ2Avy3qCnUdmjJJMqsJV+vHDt8+l52qVADgiVpEZ1mK2n8VidnVJZFE3obaRahLLp10dRheTkXkEixjMFs5wlRFpyzn+mr04lgmZR4V0LEPX6q4uBHEgKBM4Kt2Lo2tRgMAIihEO9v8LPz08+BZ9zOnAEkOcmK5xjr7NOuCoI88jzyTGFpH5dFGcVyQRlIkODi+ErBcUMAK5w86PK/gK4sYLW6975rfEDVu5/QTxcUmFtgvnMg3DmUj15QoTeNjHJxrp2qwoLcGXMFsfpscIl7cNeSYSXV5yJLWYVzZtwHnLPxlrnMb7+s74COjP5pxauEIjNqTWI8bblasD7fAqj5MtWhu0pRgIPVVTl9BJ9+Lo4OhDi2B738FaCgW8lj/41E35vmgeiG75CABaI52zSucC6Mto1MqM5yL7xVOOLWlbWdxIqV+HnFqzXObK+6hmqFMaSBwAVvhl+d8uF4QbRovfxzdXtEnORfmwe2XO83ty1Ha71ka7FqVIXvBivXPZ3fUCg7FAycU2qAl2ed793LNYLMz2oAZhlPfJXEmdUfyJxwRffN6kD+hjFn/I0tnkf0fbf6hcUYtlA01Id5QcnAN6kdpAE3g5TEQ49etgyfmJ4pTck5Df7XhJHPSjqVOG4IbdWOmMPoDjwgZ/OW1pBLtzqnviBgiXLHpPFZ31tX7cd6V3p0PI83qzyuJL0xFu+p5OkzO+WngCReRTgrXGVoc2eXQYTnvSehmAYhgFhioc3q+GgZTV7sD4Zl6GWrWUeOqF8VXBzsV5PHXLgfcwGuNz/zOq/qx+Vpk3VYYgdt5GWFxIvcYax9rMFWwa8s1uFaXlgSzK+dYojSFpifNwEk+CLqa/mrvb13AGDcAGEO2Akcc/al3EAYAHbaOWxFeDPW2EMgmncWDZqcPUTmkfXtk=',
          DropDownList1: city,
        },
      };

      request(option, (err, res, body) => {
        const $ = cheerio.load(body);
        const __VIEWSTATE = $('#__VIEWSTATE').val();
        const __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        const button = $('#Button1').val();
        const areas = $('#DropDownList2 option')
          .map((index, obj) => {
            return {
              city,
              area: $(obj).val(),
              __VIEWSTATE,
              __EVENTVALIDATION,
              button,
            };
          })
          .get();

        callback(null, areas);
      });
    },
    (error, result) => {
      callback([].concat.apply([], result));
    }
  );
}

getAreas((areas) => {
  getStores(areas, (stores) => {
    console.log('done');
  });
});
