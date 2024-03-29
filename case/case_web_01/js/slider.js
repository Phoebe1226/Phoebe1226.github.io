jQuery(document).ready(function($){
	var sliderContainers = $('.cd-slider-wrapper');

	if( sliderContainers.length > 0 ) initBlockSlider(sliderContainers);

	var slides;
	var sliderPagination;
	var counter = 1;
	
	function initBlockSlider(sliderContainers) {
		sliderContainers.each(function(){
			var sliderContainer = $(this);
			slides = sliderContainer.children('.cd-slider').children('li'),
			sliderPagination = createSliderPagination(sliderContainer);

			sliderPagination.on('click', function(event){
				event.preventDefault();
				var selected = $(this),
					index = selected.index();
					counter = index+1;
					resetAutoSlideNext();
				updateSlider(index, sliderPagination, slides);
			});

			sliderContainer.on('swipeleft', function(){
				var bool = enableSwipe(sliderContainer),
					visibleSlide = sliderContainer.find('.is-visible').last(),
					visibleSlideIndex = visibleSlide.index();
					counter = visibleSlideIndex+2;
					resetAutoSlideNext();
				if(bool){
					if(!visibleSlide.is(':last-child')) {updateSlider(visibleSlideIndex + 1, sliderPagination, slides);}	
					else {updateSlider(0, sliderPagination, slides);}
				}
				
			});

			sliderContainer.on('swiperight', function(){
				var bool = enableSwipe(sliderContainer),
					visibleSlide = sliderContainer.find('.is-visible').last(),
					visibleSlideIndex = visibleSlide.index();
					counter = visibleSlideIndex;
					resetAutoSlideNext();
				if(bool){
					if(!visibleSlide.is(':first-child')) {updateSlider(visibleSlideIndex - 1, sliderPagination, slides);}	
					else {updateSlider( 3, sliderPagination, slides);}
				}
			});

		});
	}

	var interval = setInterval(function(){autoSlideNext();}, 6000);
	function resetAutoSlideNext(){
		clearInterval(interval);
		interval = setInterval(function(){autoSlideNext();}, 6000);
	}
	function stopAutoSlideNext(){
		clearInterval(interval);
	}
	
	function autoSlideNext(){
		if(counter >= 3){ counter = 0;}
		updateSlider(counter, sliderPagination, slides);
		counter += 1;
	}
	
	function createSliderPagination(container){
		var wrapper = $('<ol class="cd-slider-navigation"></ol>');
		container.children('.cd-slider').find('li').each(function(index){
			var dotWrapper = (index == 0) ? $('<li class="selected"></li>') : $('<li></li>'),
				dot = $('<a href="#0"></a>').appendTo(dotWrapper);
			dotWrapper.appendTo(wrapper);
			var dotText = ( index+1 < 10 ) ? '0'+ (index+1) : index+1;
			dot.text(dotText);
		});
		wrapper.appendTo(container);
		return wrapper.children('li');
	}

	function updateSlider(n, navigation, slides) {
		navigation.removeClass('selected').eq(n).addClass('selected');
		slides.eq(n).addClass('is-visible').removeClass('covered').prevAll('li').addClass('is-visible covered').end().nextAll('li').removeClass('is-visible covered');

		//fixes a bug on Firefox with ul.cd-slider-navigation z-index
		navigation.parent('ul').addClass('slider-animating').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$(this).removeClass('slider-animating');
		});
	}

	function enableSwipe(container) {
		return ( container.parents('.touch').length > 0 );
	}
	
	$('.popup-link').click(function(){
	var items = [];
  $( $(this).attr('href') ).find('.mfp-figure').each(function() {
    items.push( {
      src: $(this) 
    } );
  });
  $.magnificPopup.open({
    items:items,
    gallery: {
      enabled: true 
    },
	callbacks: {
		open: function() {
			stopAutoSlideNext();
			$('html').css('margin-right', 0);
		},
		close: function() {
			resetAutoSlideNext();
		}
	}
  });
});
	
});