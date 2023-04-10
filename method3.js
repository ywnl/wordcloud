// using https://github.com/sindresorhus/got 과 cheerio 
import got from 'got';
import * as cheerio from 'cheerio';

(async () => {
    try {
        const response = await got('https://news.daum.net/', ()=>{});
        //console.log(typeof(response));
        //=> '<!doctype html> ...'
        let $ = cheerio.load(response.body);

        let targets = $('ul.list_newsissue').children();

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            console.log($(target).find('.tit_g').text().trim());
        }

    } catch (error) {
        console.log(typeof(error.response));
        //=> 'Internal server error ...'
    }
})();