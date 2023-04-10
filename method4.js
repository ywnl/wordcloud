// https://github.com/axios/axios 과 cheerio 를 사용한 버젼

import axios from 'axios';
import * as cheerio from 'cheerio';

(async ()=>{
    let res = await axios.get('https://news.daum.net/');
    let $ = cheerio.load(res.data);

    let targets = $('ul.list_newsissue').children();

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        console.log($(target).find('.tit_g').text().trim());
    }
})();

// axios.get('https://news.daum.net/')
//   .then(function (response) {
//     // handle success
//     console.log(response.body);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });
