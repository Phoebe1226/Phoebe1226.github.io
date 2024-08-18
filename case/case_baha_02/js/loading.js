jQuery(document).ready(function(){
  initPage()
});

function initPage(){
  jQuery('.page-icon-box').addClass('show').find('animate').attr({ dur: '1s', begin: '2s' });
  textEffect();
  // 字體效果
  function textEffect(){
    jQuery('.page-loading .page-icon-box').each(function(){
      var text=jQuery(this).find('h3').text().split('').map(
      function(letter,idx){
        return`<span style="animation-delay:${idx*180}ms">${letter}</span>`
      }
    ).join('');
    jQuery(this).find('h3').addClass('show').html(text);
    });
  }
  //時間

  var timer = setTimeout(function(){
     jQuery(".page-loading").addClass("finish");
  },4400)
}