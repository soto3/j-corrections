//// npmの設定 ////
var http, options, parser, qst, querystring;

var _ = require('underscore');

http = require('http');

querystring = require('querystring');

parser = require('libxml-to-js');

var fs = require('fs');

//// 処理に使う変数の設定 /////
var counter = 0;
var SummaryArray = [];

//// ファイルの読み出し。ファイル名は可変/////
var texts = fs.readFileSync('./sample.txt', 'utf-8');

// console.log(texts);

// 
// var texts = "俺とオレと俺とわたしと私なんかが、ゆれに揺れている文章。\n\
// これが2行目だ、俺。\n\
// これが3行目だ、おれ。\n\
// これが4行目だよね、私。"

///// 改行つきテキストを1行ごとに切り分ける関数 ////////
function convertText(input_text){
	var text = input_text.split(/\r\n|\r|\n/);
	// console.log(text);
	return text;
}

//// APIに文章を投げて問い合わせる関数 ////////
function ToAnalizer(lineData, lineNumber, callback){
	qst = querystring.stringify({
  		appid: 'XXXXXXXX',
  		sentence: lineData,
  		results: 'ma'
});

	options = {
  		host: 'jlp.yahooapis.jp',
  		port: 80,
  		path: '/MAService/V1/parse?' + qst
	};

	http.get(options, function(res) {
  		var body;
  		body = "";
  		res.on('data', function(data) {
    		return body += data;
  	});
  		return res.on('end', function() {
    		return parser(body, function(err, result) {
    			var words = result.ma_result.word_list.word;
    			_.each(words, function(item){
    				item.lineNumber = lineNumber + 1;
    			})
    			// console.log('----ここに行番号を付与した結果の配列が出るはず-----')
    			// console.log(words);
 				callback && callback(words, lineNumber);   		
      			// return console.log(result.ma_result.word_list);
    	});
  			});
	}).on('error', function(e) {
  		return console.log("Got error: " + e.message);
	});
}

///// 表記ゆれを検出する関数 ///////
function yureteru(word_list){
	// console.log('-------ここ-------');
	// console.log(word_list);

	var filteredWords = _.filter(word_list, function(word){
		return word && word.pos !== '特殊'
	})
	var length = filteredWords.length;
	var toIndicateWords = {};
	_.each(filteredWords, function(word, index){
		var nextindex = index + 1;
		var nextFilteredWord = filteredWords.slice(nextindex);
		_.each(nextFilteredWord, function(nextword, nextword_index){
		// 	console.log(word.reading, index);
		// 	console.log(nextword.reading, nextindex + nextword_index);
		// 	console.log('------------');
			if(word.reading === nextword.reading && word.pos === nextword.pos && word.surface !== nextword.surface){
				toIndicateWords[word.reading] = toIndicateWords[word.reading] || [];
				toIndicateWords[word.reading].push(
					word.surface +':'+ word.lineNumber,
					nextword.surface +':'+ nextword.lineNumber
				)
			}
		});
	})
	toIndicateWords = _.each(toIndicateWords, function(yomi, key){
		toIndicateWords[key] = _.uniq(yomi);
	});
	// console.log(toIndicateWords);
	return toIndicateWords;	
}

//// 検出結果をオブジェクトの配列で受け取って、出力する関数 //////
function indicate(data){
	if(Object.keys(data).length === 0){
		console.log('この形態素解析結果では表記ゆれはないようです。たぶん。たぶんね。');
	} else {
		_.each(data, function(item, key){
		console.log('「' + key + '」' + 'という読みの表記がゆれています。');
		console.log( '      ' + '出現場所（表記:行番号）' + item);
	})
	}
}

///// 1行ごとのテキストを要素にした配列を作る //////
var textArray = convertText(texts);
// console.log('----ここにテキストを改行ごとに要素にした配列が出るはず-----')
// console.log(textArray);

//// 要素ごとに行番号を付与して、SummaryArrayにためる
//// 最後にフラットな配列にして、ゆれ表記判定関数を実行
_.each(textArray, function(item, index){
	ToAnalizer(item, index, function(words, lineNumber){
		// console.log(words);
		SummaryArray.push(words);
		counter++;
		if(counter >= textArray.length){
			// console.log('done');
			// console.log(SummaryArray);
			var data = yureteru(_.flatten(SummaryArray));
			indicate(data);
		}
	});
})


