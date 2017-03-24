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
    // autoplay: true,
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
          variableWidth: false
        }
      }
    ]
  });

  // Catalog navigation 767px
  $('.catalog__navigation button').on('click', function(e){
    e.preventDefault();
    var width = $(window).width();

    if (width > 767) return;
    $(this).parent().toggleClass('is-active');

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
    $('body').css({
      'position': 'fixed',
      'padding-right': '15px'
    });
    $('.search').show();
    $('.search__block input').focus();
    search();
  });

  // Close popup search block
  $(document).on('click', '.search', function(e){
    $('body').removeAttr('style');
    $(this).hide();
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
  });
  //


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
});

// Window resize
$(window).on('resize', function(){
  search();
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
