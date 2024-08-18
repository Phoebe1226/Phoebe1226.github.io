/*
	Big Picture by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

function slowLink(id){
	$('html, body').animate({
		scrollTop: $(id).offset().top
    }, 1000);
	/*
	setTimeout(function(){
		$('html, body').animate({
			scrollTop: $(id).offset().top
        }, 1000);
	}, 0);
	*/
}

(function($) {
	var curPage = 0;
	var menuArr = [$('#intro'), $('#one'), $('#two'), $('#origin'), $('#work'), $('#stores')];
	var menuAArr = [$('#introA'), $('#oneA'), $('#twoA'), $('#originA'), $('#workA'), $('#storesA')];
	var menuAArrr = [$('#introB'), $('#oneB'), $('#twoB'), $('#originB'), $('#workB'), $('#storesB')];
	var menuMenuArr = [$('#introMenu'), $('#oneMenu'), $('#twoMenu'), $('#originMenu'), $('#workMenu'), $('#storesMenu')];
	
	$('#rwdMenu li').on('click', function(){
		$('.menu-toggle').click() //bootstrap 3.x by Richard
    });
	var clicking = true;
	$(document).click(function (event) {
		if(clicking){
			var clickover = $(event.target);
			if ($('#menuBtn').offset().left != 0 && !clickover.hasClass("menu")) {
				clicking = false;
				$('.menu-toggle').click();
			}
		}
		clicking = true;
    });
	
	var lastScrollTop = 0;
	var isSliding = false;
	$(window).bind('scroll', function () {
		//TopNavBar
		var st = $(this).scrollTop();
		if(!isSliding){
			isSliding = true;
			if (st > lastScrollTop){
				// downscroll code
				//$('#gnav').css('opacity', 0);
				//isSliding = false;
				//$('#gnav').css('display', 'none');
				$('#gnav').slideUp('600', function(){isSliding = false;});
				
			} else {
				// upscroll code
				//$('#gnav').css('opacity', 1);
				//isSliding = false;
				//$('#gnav').css('display', 'block');
				$('#gnav').slideDown('600', function(){isSliding = false;});
				
			}
		}
		lastScrollTop = st;
		var i;
		for (i = 0; i < menuArr.length; i ++){
			if($(window).scrollTop()+40 < menuArr[i].offset().top){
				break;
			}
		}
		//LeftNavBar
		if(curPage != i){
			curPage = i;
			for(var j=0; j<i; j++){
				menuAArr[j].removeClass('active');
				menuAArrr[j].removeClass('active');
				menuMenuArr[j].removeClass('active');
			}			
			menuAArr[i-1].addClass('active');
			menuAArrr[i-1].addClass('active');
			menuMenuArr[i-1].addClass('active');
			for(var j=i; j<menuArr.length; j++){
				menuAArr[j].removeClass('active');
				menuAArrr[j].removeClass('active');
				menuMenuArr[j].removeClass('active');
			}
		}
	});
	
	
	skel.breakpoints({
		wide: '(max-width: 1920px)',
		normal: '(max-width: 1680px)',
		narrow: '(max-width: 1280px)',
		narrower: '(max-width: 1000px)',
		mobile: '(max-width: 736px)',
		mobilenarrow: '(max-width: 480px)',
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$all = $body.add($header);

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 0);
			});

		// Touch mode.
			skel.on('change', function() {

				if (skel.vars.mobile || skel.breakpoint('mobile').active)
					$body.addClass('is-touch');
				else
					$body.removeClass('is-touch');

			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Gallery.
		/*
			$window.on('load', function() {
				$('.gallery').poptrox({
					baseZIndex: 10001,
					useBodyOverflow: false,
					usePopupEasyClose: false,
					overlayColor: '#1f2328',
					overlayOpacity: 0.65,
					usePopupDefaultStyling: false,
					usePopupCaption: true,
					popupLoaderText: '',
					windowMargin: (skel.breakpoint('mobile').active ? 5 : 50),
					usePopupNav: true
				});
			});
*/
		// Section transitions.
			if (!skel.vars.mobile
			&&	skel.canUse('transition')) {

				var on = function() {

					// Generic sections.
						$('.main.style1')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

						$('.main.style2')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Work.
						$('#work')
							.scrollex({
								top:		'40vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() {

												var t = $(this);

												t.find('.row.images')
													.addClass('inactive');

											},
								terminate:	function() {

												var t = $(this);

												t.find('.row.images')
													.removeClass('inactive');

											},
								enter:		function() {

												var t = $(this),
													rows = t.find('.row.images'),
													length = rows.length,
													n = 0;

												rows.each(function() {
													var row = $(this);
													window.setTimeout(function() {
														row.removeClass('inactive');
													}, 100 * (length - n++));
												});

											},
								leave:		function(t) {

												var t = $(this),
													rows = t.find('.row.images'),
													length = rows.length,
													n = 0;

												rows.each(function() {
													var row = $(this);
													window.setTimeout(function() {
														row.addClass('inactive');
													}, 100 * (length - n++));
												});

											}
							});

					// Contact.
						$('#origin')
							.scrollex({
								top:		'50%',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

				};

				var off = function() {

					// Generic sections.
						$('.main.style1')
							.unscrollex();

						$('.main.style2')
							.unscrollex();

					// Work.
						$('#work')
							.unscrollex();

					// Contact.
						$('#origin')
							.unscrollex();

				};

				skel.on('change', function() {

					if (skel.breakpoint('mobile').active)
						(off)();
					else
						(on)();

				});

			}

		// Events.
			var resizeTimeout, resizeScrollTimeout;

			$window
				.resize(function() {

					// Disable animations/transitions.
						$body.addClass('is-resizing');

					window.clearTimeout(resizeTimeout);

					resizeTimeout = window.setTimeout(function() {

						// Update scrolly links.
							$('a[href^=#]').scrolly({
								speed: 1500,
								offset: $header.outerHeight() - 1
							});

						// Re-enable animations/transitions.
							window.setTimeout(function() {
								$body.removeClass('is-resizing');
								$window.trigger('scroll');
							}, 0);

					}, 100);

				})
				.load(function() {
					$window.trigger('resize');
				});

	});

})(jQuery);