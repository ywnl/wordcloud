// MBC NEWS

import Parser from 'rss-parser';
import mecab from 'mecab-ya';
import { posAsync } from './mecabPromise.js';
import dayjs from 'dayjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// get the client
const mysql = require('mysql2/promise');


/**
 * 세계표준시 기준 타임스탬프 획득 
 */
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);


/**
 * RSS Parser 준비
 */
let parser = new Parser();

const allowFilter = [
    'NNG', // 일반 명사
    'NNP', // 고유 명사
    'MAG', // 일반 부사
    'SL', // 외국어
    'SH', // 한자
    'VA' // 형용사
];

(async ()=>{

    /**
     * 디비 커넥션
     */
    const dbconn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'project'
    });

    const [rows, fields] = await dbconn.query('SELECT * FROM channel WHERE id="MBC"');    
    
    //dbconn.end();

    const rssAddr = rows[0].rss_addr;

    let latestPubDate = dayjs.unix(1);
    
    /**
     * RSS 데이터 취득
     */
    let feed = await parser.parseURL(rssAddr);
    // console.log(feed.title);

    for (let i = 0; i < feed.items.length; i++) {

        const item = feed.items[i];

        const pubDate = dayjs(item.pubDate);

        if ( latestPubDate.isBefore(pubDate) == false ) continue;

        // mecab 형태소 분석기로 기사 제목 분석
        const feeds = await posAsync(item.title);

        // 분석 결과 속 단어 하나씩 구별하기 위해 for loop 사용
        for (let i = 0; i < feeds.length; i++) {
            let pair = feeds[i];
            let word = pair[0];
            let wordtype = pair[1];

            // 중복된 데이터가 들어가지 않도록 먼저 기존 table을 가져옴 
            const [rows, fields] = await dbconn.query('SELECT word, date, count from words');
            let table = rows;

            // table에는 timestamp 형식이 아닌 date 형식으로 저장되어 있음
            let latestdate = latestPubDate.format('YYYY-MM-DD');
            let date = pubDate.format('YYYY-MM-DD');

            // 중복 데이터 확인 전 table에 해당 단어가 들어갈 조건이 되는지 우선적으로 확인
            if (allowFilter.indexOf(wordtype) >= 0) {

                // DB에 아무 데이터가 없을 경우 첫번째 단어는 항상 들어가야 함
                if (table.length == 0){
                    const [rows, fields] = await dbconn.query('INSERT INTO words (word, word_type, date) VALUES (?,?,?)', [word, wordtype, date]);

                } else {

                    // 중복 단어인지 확인을 위해 counter인 dupe를 이용
                    let dupe = 0; 

                    // table rows 만큼 for loop 를 돌면서 중복인지 아닌지 확인
                    for (let j = 0; j < table.length; j++) {
                        let tbl_word = table[j].word;
                        let tbl_date = dayjs(table[j].date).format('YYYY-MM-DD');
                        let tbl_count = table[j].count;

                        /**
                         *  중복이라고 확신할 수 있는 조건으로
                         *  1. 단어가 똑같은지
                         *  2. 날짜가 똑같은지
                         *  를 모두 충족하면 그 해당 row 의 count만 1 증가시킴 
                         */
                        if (word == tbl_word && date == tbl_date ) {
                            const [rows, fields] = await dbconn.query('UPDATE words SET count = ? WHERE word = ? AND date = ?', [tbl_count + 1, word, date]);
                            //console.log(i, j, 'increase count',word);

                            // 중복인지 아닌지 확인하기 위한 수단으로 dupe도 1 올려줌 
                            dupe += 1;
                        };
                    };

                    /**
                     *  새로운 데이터를 for loop 가 끝난 후에 추가하는 이유는
                     *  for loop를 돌면서 같은 단어, 날짜를 만날 경우의 수는 하나이지만
                     *  단어가 서로 다를 경우는 훨씬 많고 else 문으로 이을 경우
                     *  그 단어가 여러번 table에 들어가게 되어 잘못 저장하게 됨.
                     */

                    // for loop 가 끝났음에도 dupe가 0인 경우 중복 데이터가 아님으로 새로 추가함
                    if (dupe == 0){
                        const [rows, fields] = await dbconn.query('INSERT INTO words (word, word_type, date) VALUES (?,?,?)', [word, wordtype, date]);
                    };
                };
            };
        };
    };

    dbconn.end();

    //console.log('insert complete');
        
        

    // feed.items.forEach( async item => {
    //     const pubDate = dayjs(item.pubDate);

    //     if ( latestPubDate.isBefore(pubDate) ) {

    //         const feeds = await posAsync(item.title);
    //         console.log(feeds);
    //         continue;
    //         // mecab.pos(item.title, function (err, results) {
    //         //         // console.log(results);
    //         //         // 유튜브 비디오 발행시간을 체크해서 어딘가에 메모해놓은 최신 발행시간을 비교해서
    //         //         // 그 값보다 최신이면 이하를 처리 
                    
    //         //     for (let i = 0; i < results.length; i++) {
    //         //         const words = results[i];
    //         //         const word = words[0];
    //         //         const wordtype = words[1];
                        
    //         //         if ( allowFilter.indexOf( wordtype ) >= 0 ) {

    //         //             console.log(word);

    //         //             dbconn.query('select * from words', function(err, list, fields) {
                            
    //         //             });

    //         //             // get words_youtube table and check if it has the same word

    //         //             // word table data
    //         //             // 1. 단어테이블에서 해당 날짜와 단어 조합으로 데이터 취득
    //         //             // 단어데이터가 없으면
    //         //             //   - 카운트를 1로 초기화 후 삽입
    //         //             // 단어데이터가 있으면
    //         //             // 2022-08-03T03:27:17+00:00
    //         //             // 2022-08-03T03:17:17+00:00
    //         //             //   - 해당 워드 데이터의 카운트를 +1 한후 업데이트
    //         //             // 워드 아이디 취득
        
    //         //             // word_youtube table data
    //         //             // 워드 아이디와 유튜브 아이디 로 삽입
            
    //         //         }; // for if
                    
    //         //         // 
    //         //     };
        
    //         // });
    //     }

    // });

    
})();








// ....
// dbconn.query(
//   'SELECT * FROM channel WHERE id="MBC"',
//   function(err, results, fields) {
//     dbconn.end();
//     if(err){
//         console.log(err);
        
//     }else {
        
//         for(let i=0; i<results.length; i++){

//             const result = results[i];

//             console.log(result.id);

//             (async () => {

//                 const allowFilter = [
//                   'NNG', // 일반 명사
//                   'NNP', // 고유 명사
//                   'MAG', // 일반 부사
//                   'SL', // 외국어
//                   'SH', // 한자
//                   'VA' // 형용사
//                 ];
              
              
              
//                 //let url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCF4Wxdo3inmxP-Y59wXDsFw';
//                 let url = result.rss_addr;

//                 let feed = await parser.parseURL(url);
//                 console.log(feed.title);
              
//                 let latestPubDate = dayjs.unix(1);
              
//                 // const channelId;
//                 feed.items.forEach(item => {
//                   //console.log(item.title, item.link, item.pubDate);
//                   // const youtubeId;
//                   // const publishedDate;
//                   // 2022-08-03T03:27:17+00:00
//                   // TimeStamp 로 저장
//                   // days.js 로 상호변환 및 큰지 작은지 비교
                  
//                 const pubDate = dayjs(item.pubDate);
              
//                   // unix? 리눅스 배포판 macos에 대한 기본상식
//                   // 컴파일 언어 / 인터프리터 언어
//                   // timestamp?
//                   // rdbms 에서의 date / time / timestamp
//                   // 
//                   // console.log(pubDate.format()); // local time
//                   // console.log(pubDate.utc().format()); // utc time
//                   // console.log(pubDate.unix());
              
//                 if ( latestPubDate.isBefore(pubDate) ) {
                      
//                     mecab.pos(item.title, function (err, results) {
//                           // console.log(results);
//                           // 유튜브 비디오 발행시간을 체크해서 어딘가에 메모해놓은 최신 발행시간을 비교해서
//                           // 그 값보다 최신이면 이하를 처리 
                          
//                         for (let i = 0; i < results.length; i++) {
//                             const words = results[i];
//                             const word = words[0];
//                             const wordtype = words[1];
                              
//                             if ( allowFilter.indexOf( wordtype ) >= 0 ) {

//                                 console.log(word);

//                                 dbconn.query('select * from words',
//                                 function(err, list, fields) {
                                    
//                                     })

//                                 // get words_youtube table and check if it has the same word

//                                   // word table data
//                                   // 1. 단어테이블에서 해당 날짜와 단어 조합으로 데이터 취득
//                                   // 단어데이터가 없으면
//                                   //   - 카운트를 1로 초기화 후 삽입
//                                   // 단어데이터가 있으면
//                                   // 2022-08-03T03:27:17+00:00
//                                   // 2022-08-03T03:17:17+00:00
//                                   //   - 해당 워드 데이터의 카운트를 +1 한후 업데이트
//                                   // 워드 아이디 취득
                  
//                                   // word_youtube table data
//                                   // 워드 아이디와 유튜브 아이디 로 삽입
                  
//                               }; // for if
                              
//                               // 
//                           };
                  
//                       });
//                   }
              
//                   // dayjs() returns a fresh Day.js object with the current date and time
//                   // dayjs('timestamp_1').is_before(day.js())
//                   // dayjs('timestamp_1').toJSON() or toString()을 이용해 변화 가능
              
                  
                  
              
//               });
              
//               })();

//         }
//     }

    
//     // console.log(fields); // fields contains extra meta data about results, if available
    
//   }
// );


// localhost == 127.0.0.1
// ip 내부아이피 공개아이피
// internal ip address
// external 
// public ip address





