            function getCSVFile() {
                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    createArray(xhr.responseText);
                };

                xhr.open("get", "quiz.txt", true);
                xhr.send(null);
            }
            

            function createXMLHttpRequest() {
                var XMLhttpObject = null;
                XMLhttpObject = new XMLHttpRequest();
                return XMLhttpObject;
            }

            function createArray(csvData) {
                var tempArray = csvData.split("\n");
                var csvArray = new Array();
                for(var i = 0; i<tempArray.length;i++){
                    csvArray[i] = tempArray[i].split(",");
                }
                console.log(csvArray);
            }
            

			

			
			var Q = []; //出題内容
			var A = []; //解答
			var S = []; //正解or不正解
			
			
			var qsel; // 今、選択されている問題
			var qidx; // 今、何問消化したか
			var corr; // 正答数
			// 実は、上の３変数も、qdata にまとめてしまう事は出来る（し、その方が望ましい）が、分かりやすさのため独立の変数にしてある
			
			window.onload = init; // HTML が描画されたら自動開始される関数を設定（<body onload="～"> と同等）
			
			
			
			function init() { // 「最初の画面・状況」を作る関数
			  // クイズの出題状態を初期化
			  for ( var i = 0; i < qdata.length; i ++ ) {
				//qdata[ i ].stat = 0; 
				sdata[ i ] = 0;
				// qdata の各要素に、新しいプロパティ stat を追加し、0 を設定（0 は未出題とする）
				// この結果、qdata の１要素は、{ q:質問文, a:回答群, stat:0 } という形になる
				// （このように、プロパティを後から自在に追加出来るのが JavaScript の大きな特徴）
			  }
			
			  // 全何問かを表示
			  document.getElementById( "myTotal" ).innerHTML = qdata.length;
			
			  // 各ラジオボタンを初期化
			  var rb = document.getElementsByName( "myRadio" );
			  for ( i = 0; i < rb.length; i ++ ) {
				rb[ i ].id = ( "myRadio" + i ); // 独立した id 属性を追加する（プロパティの追加と同様）
				rb[ i ].onclick = judgeSelect; // クリックした時の処理関数を設定する
			  }
			
			  // 出題数を初期化
			  qidx = 0;
			  // 正答数を初期化
			  corr = 0;
			
			  // 最初の出題をする
			  myChoice(); // 最初の問題を選ぶ
			  myQuest(); // 出題する
			  // 後の処理は、ラジオボタンを押された時の処理に委ねる（イベント駆動）
			}
			
			
			
			function myChoice() { // クイズデータからランダムに次の出題を選ぶ関数
			  // 全て出題済みなら、「選択出来ない」
			  if ( qidx >= qdata.length ) {
				qsel = -1; // （この部分は実行されないはずであるが）あえて異常値を設定
			  }
			
			  // ランダム選出する
			  qsel = Math.floor( Math.random() * qdata.length );
			  // ランダム選出位置のクイズ状態がすでに出題済みならば、(qdata[ qsel ].stat > 0)
			  while ( sdata[ qsel ] > 0 ) {
				qsel ++; // その次を選び出す
				if ( qsel >= qdata.length ) { // 「その次」がクイズ状態の総数を超えたら、
				  qsel = 0; // リセットする
				}
			  } // 未出題が見つかるまで繰り返す
			}
			
			
			
			function myQuest() { // クイズを出題する
			  // まず、ラジオボタンのチェックを全て外す
			  var rb = document.getElementsByName( "myRadio" );
			  for ( var i = 0; i < rb.length; i ++ ) {
				rb[ i ].checked = false;
			  }
			
			  // 出題数、出題文を表示
			  document.getElementById( "myIndex" ).innerHTML = ( qidx + 1 );
			  document.getElementById( "myQuestion" ).innerHTML = qdata[ qsel ];
			  //document.getElementById( "myQuestion" ).innerHTML = qdata[ qsel ].q;
			
			  // クイズの選択肢をコピーした配列を作り、シャッフルする
			  //var ac = Object.create( qdata[ qsel ].a );
			  ac = Object.create( adata[ qsel ] );
			  for ( i = 0; i < 4; i ++ ) { // シャッフルの回数は適当
			  	var rd1 = Math.floor( Math.random() * adata[ qsel ].length );
				var rd2 = Math.floor( Math.random() * adata[ qsel ].length );
				//var rd1 = Math.floor( Math.random() * qdata[ qsel ].a.length );
				//var rd2 = Math.floor( Math.random() * qdata[ qsel ].a.length );
				var t = ac[ rd1 ];
				ac[ rd1 ] = ac[ rd2 ];
				ac[ rd2 ] = t;
			  }
			
			  // シャッフルした選択肢を表示する
			  var cs = document.getElementsByName( "myCase" );
			  for ( i = 0; i < cs.length; i ++ ) {
				cs[ i ].innerHTML = ac[ i ];
			  }
			
			  // 出題済みにする
			  sdata[ qsel ] = 1;
			  
			  ndata[ qsel ] = qidx;
			  
			  Q.push(qdata[ qsel ]);
			  A.push(adata[ qsel ][0]);
			  
			 // qstats[idx].q = qdata[qsel].q;
			 // qstats[idx].a = qdata[qsel].a[0];
			  
			  
			}
			
			
			
			function judgeSelect( ) { // ラジオボタンが選択された時の処理をする関数
			// この関数が呼ばれる時は、すでに出題はされている
			
			  // どのラジオボタンが押されたのかを取得する
			  var idArr = this.id.split( "myRadio" ); // 押されたラジオボタンの id 属性を "myRadio" で分割した配列を得る
			  var id = idArr[ 1 ]; // 分割された２番目（０から数えて１番目）に数字があるのでそれを取り出す
			
			  // 正誤判定をする
			  var cs = document.getElementsByName( "myCase" ); // 選択肢を取得
			  if ( cs[ id ].innerHTML == adata[ qsel ][ 0 ] ) { // 選んだラジオボタンに相当する選択内容が、正答と合致するかどうか判定
				//alert( "Correct!" );
				document.getElementById( "judge" ).innerHTML = "Correct!";
				document.getElementById( "judge" ).style.color = "#227d51";
				
				//document.getElementById( "judge ").style.color = "green";
				
				sdata[ qsel ] = 1; //正解にする
				S.push("Correct");

				corr ++; // 正答数を加算
			  }
			  else {
				//alert( "Incorrect!" );
				document.getElementById( "judge" ).innerHTML = "Incorrect!";
				document.getElementById( "judge" ).style.color = "#9a5034";
				//document.getElementById( "judge ").style.color = "red";
				
				sdata[ qsel ] = 2; //不正解にする
				S.push("Incorrect");
			  }
			  
			  document.getElementById( "answer" ).innerHTML = "Ans: " + adata[ qsel ][ 0 ];
			  
			  for ( var i = 0; i < 4; i ++ ) {
				  document.choices.myRadio[i].disabled = true;
			  }
  
			  document.QuizFooter.nextBtn.disabled = false;
			  
			  
			  //qstats[idx].y = cs[ id ].innerHTML;
			  //qstats[idx].stat = qdata[ qsel ].stat;
			  
			  
			  
			  
			  // 消化数を加算
			  qidx ++;
			  if ( qidx >= qdata.length ) {
				  document.getElementById( "BtnText" ).innerHTML = "View<br>Result";
			  }
			  

			}
			
			function nextClick(){
				if ( qidx >= qdata.length ) {
					//alert("Finished!");
					//document.write("<h3>Result</h3>");
					//document.write("<p>Your Score:" +  corr + " / " + qdata.length + " </span></p>");
					//document.write("<p>Incorrect word:</p>");
				
					document.getElementById( "score" ).innerHTML = corr;
					document.getElementById( "Total" ).innerHTML = qdata.length;
					document.getElementById( "percent" ).innerHTML = Math.floor( corr / qdata.length * 100);
					
					var per = corr / qdata.length * 100;
					
					if( per == 100)
						document.getElementById( "comment" ).innerHTML = "Perfect! Great Job!! XD";
					else if( 80 <= per && per < 100 )
						document.getElementById( "comment" ).innerHTML = "Awesome! :-)";
					else if( 60 <= per && per < 80 )
						document.getElementById( "comment" ).innerHTML = "Great!";						
					else if( 50 <= per && per < 60 )
						document.getElementById( "comment" ).innerHTML = "Good!";
					else if( 0 <= per && per < 50 )
						document.getElementById( "comment" ).innerHTML = "Too Bad... ;-(";
					else
						document.getElementById( "comment" ).innerHTML = "";
						
					var stats = "";
					
					stats = "<center>";
					stats += "<table border=2>";
					 
					stats += "<tr>";
					stats += "<th>No.</th><th>Japanese</th><th>English</th><th>Correct or not</th>";
					stats += "</tr>";
					
					
					 for(var i = 0 ; i < qdata.length ; i++) {

						 
						stats += "<tr>";
						
						stats = stats +  "<td width=90px>Q." + (i+1) + "</td>";
					
						stats = stats +  "<td width=180px>" + Q[i] + "</td>";
						
						stats = stats +  "<td width=180px>" + A[i] + "</td>";
						
						stats = stats +  "<td width=180px>" + S[i] + "</td>";
						
						stats += "</tr>";
					
					 }
					
					
		 			stats += "</center>";
		 			stats += "</table>";
					
				
					document.getElementById( "stats" ).innerHTML = stats;
					document.QuizFooter.nextBtn.disabled = true;
				
			  }
			  else {
					document.QuizFooter.nextBtn.disabled = true;
					for ( var i = 0; i < 4; i ++ ) {
						document.choices.myRadio[i].disabled = false;
					}
					document.getElementById( "answer" ).innerHTML = "";
					document.getElementById( "judge" ).innerHTML = "";
					myChoice(); // 問題を選ぶ
					myQuest(); // 出題する 
			  }

			}
			