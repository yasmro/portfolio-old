var images = document.getElementsByTagName('img'); // ページ内の画像取得
var percent = document.getElementById('percent-text'); // パーセントのテキスト部分
//var loadingBg = document.getElementById('loadingBg'); // ローディング背景
var loading = document.getElementById('loading'); // ローディング要素
var count = 0;
//var gaugeMax = 400; // ゲージの幅指定
var current;
 
// 画像の読み込み
for (var i = 0; i < images.length; i++) {
    var img = new Image(); // 画像の作成
    // 画像読み込み完了したとき
    img.onload = function() {
        count += 1;
    }
    // 画像読み込み失敗したとき
    img.onerror = function() {
        count += 1;
    }
    img.src = images[i].src; // 画像にsrcを指定して読み込み開始
};
 
// ローディング処理
var nowLoading = setInterval(function() {
    // 現在の読み込み具合のパーセントを取得
    current = Math.floor(count / images.length * 100);
    // パーセント表示の書き換え
    percent.innerHTML = current;
    // ゲージの変更
    //gauge.style.width = Math.floor(gaugeMax / 100 * current) + 'px';
    // 全て読み込んだ時
    if(count == images.length) {
        // ローディング要素の非表示
        loadingBg.style.display = 'none';
        loading.style.display = 'none';
        // ローディングの終了
        clearInterval(nowLoading);
    }
}, 100);