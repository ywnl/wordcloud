// SBS NEWS 

import Parser from 'rss-parser';
import mecab from 'mecab-ya';

let parser = new Parser();

(async () => {

  let url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkinYTS9IHqOEwR1Sze2JTw';  
  let feed = await parser.parseURL(url);
  console.log(feed.title);

  feed.items.forEach(item => {
    //console.log(item.title + ':' + item.link)
    //console.log(item.title, item.link, item.pubDate);
    
    mecab.pos(item.title, function (err, result) {
        console.log(result);

    });

});

})();