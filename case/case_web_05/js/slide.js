(function($){
	$(function(){

		$("#slider").each(function(){

			var PIC_W;
			var ua = navigator.userAgent;
			var isIE6 = (ua.indexOf("MSIE 6")>=0);

			var $slider = $(this);
			var $pics = $slider.find(".pics");

			//ランダムにセットを選択
			$pics = $($pics[$pics.length*Math.random()|0]);

			//写真のコメントアウトを削除
			var picHtml = $pics.html( $pics.html().split("<!--").join("").split("-->").join("") );

			//開始位置をランダムに
			var $picArr = [];
			$pics.find("li").each(function(index){
				var $pic = $(this).remove();
				$picArr.push($pic)
			})
			var startInd = Math.random() * $picArr.length | 0;
			$picArr = $picArr.slice(startInd).concat( $picArr.slice(0, startInd) );
			var i, len = $picArr.length;
			for (i = 0; i < len; i++) {
				var $pic = $picArr[i];
				$pics.append($pic);
			}

			//写真をランダムに配置しなおす
//			var $picArr = [];
//			$pics.find("li").each(function(index){
//				var $pic = $(this).remove();
//				$picArr.push($pic)
//			})
//			$picArr.sort(function(a,b){ return Math.random()<0.5? 1: -1; });
//			var i, len = $picArr.length;
//			for (i = 0; i < len; i++) {
//				var $pic = $picArr[i];
//				$pics.append($pic);
//			}

			//写真のロード
			$pics.find("li").each(function(index){
				var $pic = $(this);
				PIC_W = parseInt( $pic.css("width"), 10 );
				
			})

			//写真の移動
			var $currentPic = $pics.find("li").eq(0);
			var marginLeft = 0;
			setInterval(function(){
				marginLeft -= 1;
				if(marginLeft<=-PIC_W) {
					$currentPic.css("margin-left", 0).appendTo($pics);
					$currentPic = $pics.find("li").eq(0);
					marginLeft = 0;
				} else {
					$currentPic.css("margin-left", marginLeft);
				}
			}, 24)

		})

	})
})(jQuery)