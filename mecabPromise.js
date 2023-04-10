import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mecab = require('mecab-ya');

function posAsync(text){
    return new Promise(function(resolve, reject){

        mecab.pos(text, function(err, results){
            if(err) {
                reject(new Error(err));
            }
            resolve(results);
        });

    });
}

export { posAsync };
