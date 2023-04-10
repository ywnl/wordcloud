//Method1

const Crawler = require('crawler');

const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            
            const $ = res.$;
            // $ is Cheerio by defaults
            //a lean implementation of core jQuery designed specifically for the server\

            // 공통 부모에서 시작해서 children 을 가져옴
            let targets = $('ul.list_newsissue').children();
            // targets는 <li> 들을 가리킴 

            for (let i = 0; i < targets.length; i++) {
                // childnode 하나를 가져옴
                // 여기서 childnode는 <Li> 태그를 가지고 있는 기사 하나를 말함 
                const target = targets[i];

                //  childnode에서 .tit_g 를 포함하는 노드를 찾아
                //  노드의 텍스트를 추출하고
                //  trim 메서드를 통해 탭과 공백을 제거90한후
                //  출력

                console.log($(target).find('.tit_g').text().trim());
              };
            };
        done();
    }
});


c.queue('https://news.daum.net');