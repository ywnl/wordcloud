//Method 2

const Crawler = require('crawler');

// 기사 제목을 가져올 주소: https://news.daum.net/

// 이 방법은 범위 밖의 다른 제목들도 가져오므로 원하는 결과가 나오지 않음!!
const c2 = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server\

            // 먼저 기사 리스트를 직접적으로 정한 좁은 범위에서 시작.
            // 여기서 정한 범위가 원하지 않는 정복까지 포함되는 것이 문제점.
            let elements = $('strong.tit_g');

            // 기사리스트를 통째로 가져왔으므로 더 작게 쪼개어 기사 제목들만 가져오게끔 해야함
            
            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];
                // elements가 가지고 있는 children을 불러오면 기사 제목 정보는 index 1에 들어있음
                // elements children[1]을 보면 index 0 에 기사 제목이 들어있음
                // elements children[1] children[0] 에서 기사 제목은 data 란에 있음
                // data를 뽑아내어 기사 제목 하나하나 출력 가능
                console.log(elem.children[1].children[0].data.trim());
            };
        };
        done();
    }
});

c2.queue('https://news.daum.net');