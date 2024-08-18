		//Get all boxes
		//Judge width and insert menu to actived boxed
		var subMenu = '<div class="submenu clearfix" id="subMenu"> \
						<ul class="clearfix"> \
							<li><a href="#">健保費</a></li> \
							<li><a href="#">中華電信費</a></li> \
							<li><a href="#">遠傳電信費</a></li> \
							<li><a href="#">台灣大哥大電信費</a></li> \
							<li><a href="#">台灣之星電信費</a></li> \
							<li><a href="#">eTag儲值</a></li> \
							<li><a href="#">臺北市路邊停車費</a></li> \
							<li><a href="#">新北市路邊停車費</a></li> \
							<li><a href="#">臺中市停車費</a></li> \
							<li><a href="#">高雄市路邊停車費</a></li> \
							<li><a href="#">臺北自來水費</a></li> \
							<li><a href="#">臺南市停車費</a></li> \
						</ul> \
					</div>';
		var numItemsPerLine = -1;
		var menuArr = [];
		$('#mainMenu > div').each(function(){
			if(this.className.indexOf("box") > -1){
				$(this).attr('onclick', 'openSubMenu('+menuArr.length+')');
				menuArr.push(this);
			}
		});
		
		resizeSubMenu();
		$( window ).resize(function() {
			resizeSubMenu();
		});
		
	var subMenuIndex = -1;
	var isSubMenuOpened = false;
	function closeSubMenu(index){
		if(isSubMenuOpened){
			$(menuArr[subMenuIndex]).removeClass('selected');
			$('#subMenu'+index).slideUp('',function(){
				$('#subMenu'+index).remove();
				if(index == subMenuIndex){
					subMenuIndex = -1;
					isSubMenuOpened = false;
				}
			});
			if(index != subMenuIndex){
				subMenuIndex = -1;
				isSubMenuOpened = false;
			}
		}
	}
	
	function openSubMenu(index){
		if(index == subMenuIndex){
			closeSubMenu(index);
			return;
		}
		closeSubMenu(subMenuIndex);
		$(menuArr[index]).addClass('selected');
		subMenuIndex = index;
		isSubMenuOpened = true;
		
		var insertIndex = -1;
		if((index+1)%numItemsPerLine != 0 && 
			Math.floor(index/numItemsPerLine) == Math.floor(menuArr.length/numItemsPerLine)){
			insertIndex = menuArr.length-1;
		} else {
			insertIndex = Math.floor(index/numItemsPerLine)*numItemsPerLine+numItemsPerLine-1;
		}
		$(menuArr[insertIndex]).after(subMenu);
		$('#subMenuClose').attr('onclick', 'closeSubMenu('+index+')');
		$('#subMenu').slideDown();
		$('#subMenu').attr('id', 'subMenu'+index);
	}	
	
	function resizeSubMenu(){
		var numChanged = false;
		var winWidth = $(window).width();
		if(winWidth <= 459){
			if(numItemsPerLine != 3){numChanged = true;}
			numItemsPerLine = 3;
		} else if(459 < winWidth && winWidth <= 970){
			if(numItemsPerLine != 4){numChanged = true;}
			numItemsPerLine = 4;
		} else {
			if(numItemsPerLine != 6){numChanged = true;}
			numItemsPerLine = 6;
		}
		if(isSubMenuOpened && numChanged){
			closeSubMenu(subMenuIndex);
		}
	}


//img src SVG changing the fill color 檔案需放上server才看得到效果
$(function(){
    jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
    
        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
    
            // Replace image with new SVG
            $img.replaceWith($svg);
    
        }, 'xml');
    
    });
});