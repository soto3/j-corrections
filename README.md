j-corrections
=======================
## j-correctionsとは

編集作業用の小さなプログラムです。指定したテキストファイルの「表記ゆれ」を検出します。現在のところOS Xでのみ動作確認をしています。

## 使い方

node.jsで動きます。node.jsのインストールおよびインストール方法は、下記を参照してください。

[node.js](http://nodejs.jp/nodejs.org_ja/docs/v0.10/)

Yahooの[日本語形態素解析API]( http://jlp.yahooapis.jp/MAService/V1/parse )を使用して解析しているので、Yahoo! Japan IDとアプリケーションIDが必要です。取得は以下を参照してください。

[Yahoo! Japanデベロッパーネットワーク]( http://developer.yahoo.co.jp/start/ )

なんちゃってpackage.jsonをつけてますが、npmには公開していません。動作には、以下のモジュールが必要です。

- [underscore] ( https://www.npmjs.org/package/underscore )
- [http]( https://www.npmjs.org/package/http )
- [querystring]( https://www.npmjs.org/package/querystring )
- [libxml-to-js]( https://www.npmjs.org/package/libxml-to-js )

モジュールは、プログラムがあるフォルダで、ターミナルから以下のコマンドを打つとたいていインストールされるはずです。

```
$ npm install モジュール名
```

同じフォルダに解析したいテキスト`sample.txt`をおき、`node j-corrections.js`とコマンドをば。しばらくすると（APIに1行ずつ問い合わせを入れるので時間がかかります）解析結果が出力されます。

```
「1」という読みの表記がゆれています。
      出現場所（表記:行番号）1:64,一:173,一:181,一:190,1:202,1:422
「2」という読みの表記がゆれています。
      出現場所（表記:行番号）2:68,二:271
「つい」という読みの表記がゆれています。
      出現場所（表記:行番号）つい:1,付い:5,つい:7,つい:16,つい:82,つい:418,つい:440
「いっ」という読みの表記がゆれています。
      出現場所（表記:行番号）いっ:7,行っ:224,いっ:12
「とおり」という読みの表記がゆれています。
      出現場所（表記:行番号）通り:173,とおり:407
「すでに」という読みの表記がゆれています。
      出現場所（表記:行番号）すでに:190,既に:199
```

## 既知の問題

- Yahoo APIで解析できなかった単語などは、単純に無視して解析します。
- 解析結果に文字化けがあった場合、「表記ゆれ」として検出してしまうことがあります。

## 動作環境

OS X 10.9.2で確認しています。

## 注意事項

プログラムの勉強のために作ったものを仮に公開しています。解析結果の正確性はもとより、バグがないこと、また、プログラムがお使いのマシンに影響を与えないことなどを、作者は一切保証しません。ご自身の判断でお使いくださいね。

もし試しに使っちゃって、問題を見つけちゃったりしたら、issuesにお願いします。対応できるかどうかは不明ですが、ありがとうございます！

### 謝辞

開発合宿で運悪く（？）先生になってくれた両名に感謝します。ひとりでやってたら、5万年かかっても、書けない。じまぐさん、げこたんありがとうございます。これからもよろしくお願いします。うひひ。

- [nakajmg]( https://github.com/nakajmg )
- [geckotang]( https://github.com/geckotang )
