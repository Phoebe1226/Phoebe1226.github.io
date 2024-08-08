(function($) {

    "use strict";

    //  Header sticky
    const headerSticky = function() {
      const header = document.querySelector('#header');
      if (!header) return;      
      const trigHeight = 1;

      window.addEventListener('scroll', function () {
          let tj = window.scrollY;

          if (tj > trigHeight) {
              header.classList.add('sticky');
          } else {
              header.classList.remove('sticky');
          }
      });
    };

    // init jarallax parallax
    var initJarallax = function() {
      jarallax(document.querySelectorAll(".jarallax"));

      jarallax(document.querySelectorAll(".jarallax-img"), {
        keepImg: true,
      });
    }

    // product quantity
    var initProductQty = function(){

      $('.product-qty').each(function(){

        var $el_product = $(this);
        var quantity = 0;

        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            $el_product.find('#quantity').val(quantity + 1);
        });

        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            if(quantity>0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });

      });

    }

    $(document).ready(function() {
      
      /* Video */
      var $videoSrc;  
        $('.play-btn').click(function() {
          $videoSrc = $(this).data( "src" );
        });

        $('#myModal').on('shown.bs.modal', function (e) {

        $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
      })

      $('#myModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src',$videoSrc); 
      })

      var swiper = new Swiper(".main-swiper", {
        loop: true,
        speed: 800,
        autoplay: {
          delay: 6000,
        },
        effect: "creative",
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
        pagination: {
          el: ".main-slider-pagination",
          clickable: true,
        },
      });
      
      var swiper = new Swiper(".product-swiper", {
        speed: 1000,
        spaceBetween: 20,
        navigation: {
          nextEl: ".product-carousel-next",
          prevEl: ".product-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          }
        },
      }); 

      var swiper = new Swiper(".testimonial-swiper", {
        speed: 1000,
        navigation: {
          nextEl: ".testimonial-arrow-next",
          prevEl: ".testimonial-arrow-prev",
        },
      });

      var thumb_slider = new Swiper(".thumb-swiper", {
        slidesPerView: 1,
      });
      var large_slider = new Swiper(".large-swiper", {
        spaceBetween: 10,
        effect: 'fade',
        thumbs: {
          swiper: thumb_slider,
        },
      });

      headerSticky();
      initJarallax();
      initProductQty();
      AOS.init();
      
    }); // End of a document ready

    window.addEventListener("load", function () {
      const preloader = document.getElementById("preloader");
      preloader.classList.add("hide-preloader");      
    });

    
    $(window).scroll(function() {
          if ($(this).scrollTop() > 40) {
              $('.site-header').addClass('site-header-scroll');
          } else {
              $('.site-header').removeClass('site-header-scroll');
          }
      });
/*-------------------
		Quantity change
	--------------------- */
  var proQty = $('.pro-qty');
  proQty.prepend('<span class="fa fa-angle-down inc qtybtn"></span>');
  proQty.append('<span class="fa fa-angle-up dec qtybtn"></span>');
  proQty.on('click', '.qtybtn', function () {
      var $button = $(this);
      var oldValue = $button.parent().find('input').val();
      if ($button.hasClass('inc')) {
          var newVal = parseFloat(oldValue) + 1;
      } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
              var newVal = parseFloat(oldValue) - 1;
          } else {
              newVal = 0;
          }
      }
      $button.parent().find('input').val(newVal);
  });

  var proQty = $('.pro-qty-2');
  proQty.prepend('<span class="fa fa-angle-down inc qtybtn"></span>');
  proQty.append('<span class="fa fa-angle-up dec qtybtn"></span>');
  proQty.on('click', '.qtybtn', function () {
      var $button = $(this);
      var oldValue = $button.parent().find('input').val();
      if ($button.hasClass('inc')) {
          var newVal = parseFloat(oldValue) + 1;
      } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
              var newVal = parseFloat(oldValue) - 1;
          } else {
              newVal = 0;
          }
      }
      $button.parent().find('input').val(newVal);
  });


    /*-------------------
		Scroll
	--------------------- */
  $(".nice-scroll").niceScroll({
      cursorcolor: "#0d0d0d",
      cursorwidth: "5px",
      background: "#e5e5e5",
      cursorborder: "",
      autohidemode: true,
      horizrailenabled: false
  });

    /*------------------
        Accordin Active
    --------------------*/
    $('.collapse').on('shown.bs.collapse', function () {
      $(this).prev().addClass('is-active');
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).prev().removeClass('is-active');
    });

    //Canvas Menu
    $(".canvas__open").on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("is-active");
        $(".offcanvas-menu-overlay").addClass("is-active");
    });

    $(".offcanvas-menu-overlay").on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("is-active");
        $(".offcanvas-menu-overlay").removeClass("is-active");
    });

    /*-------------------
		Radio Btn
	--------------------- */
  $(".product__color__select label").on('click', function () {
    var $currentItem = $(this).closest('.product__item');
    $currentItem.find('.product__color__select label').removeClass('is-active');
    $(this).addClass('is-active');
  });
   //切換側欄顏色選擇
   $('.shop__sidebar__color .color-label').on('click', function() {
    var $this = $(this);
    if ($this.hasClass('is-active')) {
        $this.removeClass('is-active');
    } else {
        $this.addClass('is-active');
    }
  });
  //切換側欄顏色選擇
  $('.shop__sidebar__tags a').on('click', function() {
   var $this = $(this);
   if ($this.hasClass('is-active')) {
       $this.removeClass('is-active');
   } else {
       $this.addClass('is-active');
   }
 });
 
  //切換詳細頁選擇
$(document).ready(function(){
  $('.product__details__option__size label').on('click', function() {
      $('.product__details__option__size label').removeClass('is-active');
      $(this).addClass('is-active');
  });
});

$(document).ready(function(){
  $('.product__details__option__color label').on('click', function() {
      $('.product__details__option__color label').removeClass('is-active');
      $(this).addClass('is-active');
  });
});
 /*-------------------
		Range Slider
	--------------------- */
	var rangeSlider = $(".price-range"),
    minamount = $("#minamount"),
    maxamount = $("#maxamount"),
    minPrice = rangeSlider.data('min'),
    maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
    range: true,
    min: minPrice,
    max: maxPrice,
    values: [minPrice, maxPrice],
    slide: function (event, ui) {
        minamount.val('$' + ui.values[0]);
        maxamount.val('$' + ui.values[1]);
        }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

 /*-------------------
		顯示隱藏篩選單
	--------------------- */
    $(document).ready(function() {
      $('a.toggle-accordion').on('click', function(e) {
          e.preventDefault();
          $('.shop__sidebar__accordion').slideDown();
      });

      $('a.close-accordion').on('click', function(e) {
          e.preventDefault();
          $('.shop__sidebar__accordion').slideUp();
      });
    });
    $(document).on('click', function(e) {
      if (window.innerWidth < 991) {
          if (!$(e.target).closest('.shop__sidebar__accordion, .toggle-accordion').length) {
              $('.shop__sidebar__accordion').hide();
          }
        }
    });

})(jQuery);