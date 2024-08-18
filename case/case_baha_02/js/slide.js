(function($){
  $(function(){

    $(".slider").each(function(){

      var PIC_W;
      var ua = navigator.userAgent;
      var isIE6 = (ua.indexOf("MSIE 6")>=0);

      var $slider = $(this);
      var $pics = $slider.find(".pics");

      $pics = $($pics[$pics.length*Math.random()|0]);

      var picHtml = $pics.html( $pics.html().split("<!--").join("").split("-->").join("") );

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

      $pics.find("li").each(function(index){
        var $pic = $(this);
        PIC_W = parseInt( $pic.css("width"), 10 );
        
      })
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