'use strict'

// Document ready
$(document).ready(function(){

  // SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
    	verticalFit: true
    }
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  // Magnific popup inline block
  $('.open-popup-link').magnificPopup({
    type: 'inline',
    midClick: true,
    mainClass: 'mfp-bg--imgSmall'
  });

  // Magnific popup register - double background in poup
  $('.open-popup-register').on('click', function(e){
    e.preventDefault();
    $.magnificPopup.close();

    setTimeout(function(){
      $.magnificPopup.open({
        items: {
          src: '#register'
        },
        type: 'inline',
        midClick: true,
        mainClass: 'mfp-bg--imgSmall-double'
      }, 0);
    }, 0)
  });

  // Magnific popup enter - remove double background in popup
  $('.open-popup-enter').on('click', function(e){
    e.preventDefault();
    $.magnificPopup.close();

    setTimeout(function(){
      $.magnificPopup.open({
        items: {
          src: '#enter'
        },
        type: 'inline',
        midClick: true,
        mainClass: 'mfp-bg--imgSmall'
      }, 0);
    }, 0)
  });

  // Header top contacts mobile block
  $('.btn--phones').on('click', function(e){
    e.preventDefault();
    $(this).parents('.header__contacts').toggleClass('is-active');
  });

  // Function
  menuImg();
  search();

  // Main catalog carousel
  $('.catalog__carousel').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    dots: true,
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
          variableWidth: false
        }
      }
    ]
  });

  // Product viewed
  $('.catalog__viewed').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    dots: false,
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });

  $('.catalog__navigation.is-active nav').show();

  // Catalog navigation 767px
  $('.catalog__navigation button').on('click', function(e){
    e.preventDefault();
    var width = $(window).width();

    if ($(this).parent().hasClass('is-active')) {
      $(this).parent().removeClass('is-active');
      $(this).next('nav').slideUp();
    } else if (!$(this).parent().hasClass('is-active')) {
      $(this).parent().addClass('is-active');
      $(this).next('nav').slideDown();
    }

  });

  // Filter navigation 767px
  $('.filter__button').on('click', function(e){
    e.preventDefault();
    var width = $(window).width();

    if ($(this).parents('.filter').hasClass('is-active')) {
      $(this).parents('.filter').removeClass('is-active');
      $(this).next('.filter__body').slideUp();
    } else if (!$(this).parents('.filter').hasClass('is-active')) {
      $(this).parents('.filter').addClass('is-active');
      $(this).next('.filter__body').slideDown();
    }

    if (width <= 767) {
      $('.has-hide').readmore({
        speed: 500,
        collapsedHeight: 130,
        moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
        lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
      });

      $('.has-hide--category').readmore({
        speed: 500,
        collapsedHeight: 370,
        moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
        lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
      });
    }

  });

  // Ol li custom marker
  $('ol.ol--list li').each(function(){
    $(this).prepend('<span>' + ($(this).index() + 1) + '</span>');
  });

  // Custom scroll - vertical
  $(".nano").nanoScroller({
    alwaysVisible: true,
    preventPageScrolling: true
  });

  // Open popup search block
  $(document).on('click', '.link-search', function(e){
    e.preventDefault();
    e.stopPropagation();
    $('body').css({
      'position': 'fixed',
      'padding-right': '15px'
    }).addClass('is-search');
    $('.search').show();
    $('.search__block input').focus();
    search();
  });

  function afaxAdvancedSearch() {
    var afaxAdvancedSearch = $('.search__block input[type="text"]');

    afaxAdvancedSearch.on('focusout', function () {
      $('body').removeAttr('style').removeClass('is-search');
      $('.search').hide();
      console.log('focus out');
    });
  };
  afaxAdvancedSearch();

  // Close popup search block
  $(document).on('click', '.search', function(e){
    $('body').removeAttr('style').removeClass('is-search');
    $('.search').hide();
  });

  // Search popup stop close
  $('.search__block').on('click', function(e){
    e.stopPropagation();
  });

  // Mobile menu
  $('.menu__mobile button').on('click', function(e){
    e.preventDefault();
    $(this).parent().toggleClass('is-active');
    // $(this).next('nav').slideToggle();
  });

  // Private cabinet cart
  $('.order-list__row').each(function(){
    var _this = $(this);

    _this.find('.order-list__turn').on('click', function(){
      var parents = $(this).parents('.order-list__row');
      if (parents.hasClass('is-active')) {
        parents.removeClass('is-active');
        _this.find('.order-list__turn').text('Развернуть')
      } else {
        parents.addClass('is-active');
        _this.find('.order-list__turn').text('Свернуть')
      }
    });

    _this.find('.order__show').on('click', function(){
      var parents = $(this).parents('.order-list__row');
      if (parents.hasClass('is-active')) {
        parents.removeClass('is-active');
        _this.find('.order-list__turn').text('Развернуть')
      } else {
        parents.addClass('is-active');
        _this.find('.order-list__turn').text('Свернуть')
      }
    });

  });

  //Custom select
  $('select.niceSelect').niceSelect();

  // Readmore
  $('.has-readmore').readmore({
    speed: 500,
    collapsedHeight: 230,
    moreLink: '<div class="readmore"><a href="#">Подробнее</a></div>',
    lessLink: '<div class="readmore"><a href="#">Закрыть</a></div>'
  });

  // Product color carousel
  $('.product__color ul').slick({
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    variableWidth: true
  });

  // Product gallery carousel
  $('.product__gallery__left ul').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    infinite: false,
    verticalSwiping: true
  });

  CloudZoom.quickStart();

  $('.product__gallery__left .slick-current').addClass('is-active');
  $('.product__gallery__left .cloudzoom-gallery').on('click', function(e){
    e.preventDefault();
  });
  $('.product__gallery__left .cloudzoom-gallery').on('hover', function(){
    $('.cloudzoom-gallery').parent().removeClass('is-active');
    $(this).parent().addClass('is-active');
  });

  // Data color background
  $('.data-color').each(function(){
    $(this).css({
      background: '#' + $(this).data('color')
    });
  });

  // Jquery UI slider
  $("#filter__range").slider({
  	min: 0,
  	max: 20000,
  	values: [5000,15000],
  	range: true,
  	stop: function(event, ui) {
      $("input#priceMin").val($("#filter__range").slider("values",0));
      $("input#priceMax").val($("#filter__range").slider("values",1));

      $('.price-range-min.value').html($("#filter__range").slider("values",0));
      $('.price-range-max.value').html($("#filter__range").slider("values",1));
    },
    slide: function(event, ui){
      $("input#priceMin").val($("#filter__range").slider("values",0));
      $("input#priceMax").val($("#filter__range").slider("values",1));

      $('.price-range-min.value').html($("#filter__range").slider("values",0));
      $('.price-range-max.value').html($("#filter__range").slider("values",1));
    }
  });

  $("input#priceMin").on('change', function(){
  	var value1=$("input#priceMin").val();
  	var value2=$("input#priceMax").val();
    if(parseInt(value1) > parseInt(value2)){
  		value1 = value2;
  		$("input#priceMin").val(value1);
      $('.price-range-min.value').html(value1);
  	}
  	$("#filter__range").slider("values", 0, value1);
    $('.price-range-min.value').html(value1);
  });

  $("input#priceMax").on('change', function(){
  	var value1=$("input#priceMin").val();
  	var value2=$("input#priceMax").val();
  	if (value2 > 20000) { value2 = 20000; $("input#priceMax").val(35000)}
  	if(parseInt(value1) > parseInt(value2)){
  		value2 = value1;
  		$("input#priceMax").val(value2);
      $('.price-range-max.value').html(value2);
  	}
  	$("#filter__range").slider("values",1,value2);
    $('.price-range-max.value').html(value2);
  });

  $('.ui-slider-handle:eq(0)').append('<span class="price-range-min value">' + $('#filter__range').slider('values', 0 ) + '</span>');
  $('.ui-slider-handle:eq(1)').append('<span class="price-range-max value">' + $('#filter__range').slider('values', 1 ) + '</span>');


  // фильтрация ввода в поля
  $('input').on('keypress', function(event){
    var key, keyChar;
    if(!event) var event = window.event;
    if (event.keyCode) key = event.keyCode;
    else if(event.which) key = event.which;
    if(key==null || key==0 || key==8 || key==13 || key==9 || key==46 || key==37 || key==39 ) return true;
    keyChar=String.fromCharCode(key);
    if(!/\d/.test(keyChar))	return false;
  });

  // Hide filter block
  $('.has-hide').readmore({
    speed: 500,
    collapsedHeight: 130,
    moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
    lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
  });

  // Hide filter block
  $('.has-hide--category').readmore({
    speed: 500,
    collapsedHeight: 370,
    moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
    lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
  });



  // Collection carousel
  $('.collection__carousel ul').slick({
    slidesToShow: 3,
    infinity: true,
    centerMode: true,
    autoplay: true,
    easing: 'ease-out',
    speed: 1000,
    pauseOnHover: false,
    arrows: false,
    dots: true,
    draggable: false,
    customPaging : function(slider, i) {
      return '<div class="slide-page">0' + (i+1) + '</div>';
    },
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // fade: true,
          // cssEase: 'linear'
        }
      }
    ]
  });

  $('.collection__carousel ul').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    carouselName();
  });

  carouselName();

  // Product gallery zoom img hide
  $(document).on('mousemove', function(){
    if ($('.cloudzoom-zoom').length > 0) {
      $('.product__zoom').hide();
    } else {
      $('.product__zoom').show();
    }
    // console.log($('.cloudzoom-zoom'));
  });

  // Product size count
  $(document).on('click', '.product__size', function(e){
    if ($(this).find('input').is(':checked')) {
      $('.product__count').slideDown();
    } else {
      $('.product__count').slideUp();
    }
  })

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
        $.smoothScroll();
    }
  } catch(err) {

  };

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

// Window load
$(window).on('load', function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");

  // Active slick carousel in bootstrap tab
  $('.slides').on('setPosition', function () {
    $(this).find('.slick-slide').height('auto');
      var slickTrack = $(this).find('.slick-track');
      var slickTrackHeight = $(slickTrack).height();
      $(this).find('.slick-slide').css('height', slickTrackHeight + 'px');
  });

  // carouselName();
});

// Window resize
$(window).on('resize', function(){
  var width = $(window).width()
  search();

  if (width <= 767 && $('.catalog__navigation').hasClass('is-active')) {
    $('.catalog__navigation').removeClass('is-active');
    $('.catalog__navigation nav').hide();
  }

  if (width > 767) {
    $('.filter').removeClass('is-active');
    $('.filter__body').removeAttr('style');
  }

  $('.has-hide').readmore({
    speed: 500,
    collapsedHeight: 130,
    moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
    lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
  });

  $('.has-hide--category').readmore({
    speed: 500,
    collapsedHeight: 370,
    moreLink: '<div class="filter__more"><a href="#!">Показать фильтр</a></div>',
    lessLink: '<div class="filter__more"><a href="#!">Скрыть фильтр</a></div>'
  });

});

// Custom menu img link hover
function menuImg(){
  var a = $('.menu__li2 a');
  a.on('hover', function(e){
    // console.log($(this).data('img'));
    $(this).parents('.menu__ul2').find('.menu__img').attr('src', $(this).data('img'))
  });
}

// Search popup
function search(){
  // if ($('.search').hide()) return;
  var width = $(window).width();
  var social = $('.header__social a:last-child'),
      search = $('.header__links a:first-child'),
      socialPos = social.offset(),
      searchPos = search.offset();
  if (width > 767) {
    $('.search__block').css({
      'top': socialPos.top + 'px',
      'left': socialPos.left + 'px',
      'width': searchPos.left - socialPos.left + 30 + 'px'
    });
  }
  // console.log(searchPos.top);
}

function carouselName(){
  var carousel = $('.collection__carousel'),
      current = carousel.find('.slick-current'),
      name = current.find('a').data('name'),
      frameName = $('.collection__frame__name')
  ;

  frameName.text(name);

  // console.log(name);
}

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();

    var formData = {};

    var hasFile = false;

    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');

    return false;
  });
}
