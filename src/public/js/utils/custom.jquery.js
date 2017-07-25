//svg icons
export function replaceSVGIcons() {
  jQuery('img.svg').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
            // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

            // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });
}

// To open and close dropdown
export function selectDropdown() {
  let sisel = 1;
  $('div.std-form input.select').click(function () {
    sisel =! sisel;
    $('div.select-values').hide();
    if(!sisel) $(this).parent().find('div.select-values').show();
    else  $(this).parent().find('div.select-values').hide();
    $(this).blur();
  });

  $('div.std-form div.select-values div').click(function () {
    $(this).parent().parent().find('input.select').val($(this).html());
    $('div.select-values').hide();
    sisel = 1;
  });
}

//course-register ok window
export function courseRegisterOkWindow() {
  $('a.inscribirse').click(function () {
    if (confirm('�Seguro que deseas inscribirte a este curso?')) {
      $('#modal-ok').fadeIn();
    }
  });
}

export function closeModalWindow() {
  $('.close_window').click(function () {
    $('.modal-wrapper').fadeOut();
    $('body').removeClass('modal-on');
  });
}

//submit tutorial
export function submitTutorial() {
  $('#submit-tutoria').click(function () {
    if(!$('#field1').val() || !$('#field2').val()) {
      $('#modal-external').fadeIn();
      return false;
    }
  });
}

//key press
export function closeModalOnKeyPress() {
  $(document).keyup(function (e) {
    if (e.keyCode === 27) // escape key maps to keycode '27'
      $('.modal-wrapper').fadeOut();
  });
}

//play carousel
export function playCarousel() {
  $("div.slider-header").each(function(i) {
    let idSlider = $(this).attr('id');
    let slider = new Slider('#' + idSlider, 5000);
    slider.play();
  });
}

//stop carousel
export function stopSliderCarousel(id) {
  $("div.slider-header").each(function(i) {
    if(id) {
      let idSlider = id;//$(this).attr('id');
      let slider = new Slider('#' + idSlider, 5000);
      slider.stop();
    }
  });
}

//stop carousel
export function stopCarousel() {
  $("div.slider-header").each(function(i) {
    let idSlider = $(this).attr('id');
    let slider = new Slider('#'+idSlider, 5000);
    slider.stop();
  });
}

//open popup for herramientas
export function openHerramientasPopup() {
  $('.external_link').click(function() {
    $('#modal-external').fadeIn();
    let link = $(this).attr('title');
    $('#modal-external #link-ok').attr('href', link);
    $('body').addClass('disable-scroll');
  });
}

//close herramientas popup and close on keypress
export function closeHerramientasPopup() {
  $(document).keyup(function(e) {
    if (e.keyCode === 27) 
      $('.modal-wrapper').fadeOut();
    $('body').removeClass('disable-scroll');
  });

  $('.close_window').click(function() {
    $('.modal-wrapper').fadeOut();
    $('body').removeClass('modal-on, disable-scroll');
  });
}

//postlogin header functionlaity
export function postLoginFunctionality() {
    //submenu
  $('#show-sub-ayuda').click(function() {
    $('#sub-ayuda').fadeToggle();
    return false;
  });

    //hide sub-menu on outside click
  $(document).mouseup(function (e) {
    var container = $('div.select-values, #sub-ayuda');

    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
    }
  });

    //responsive-menu
  $('#responsive-menu-toggler, .responsive-menu-toggler, div.back-submenu-responsive').click(function () {
    $('ul.submenu-responsive').toggleClass('on');
    $('div.back-submenu-responsive').fadeToggle();
    if($('.submenu-responsive').hasClass('on'))
        {
      $('.input.zindex3, .input.zindex4, .input.zindex5').css('z-index','1');
    }
    else
        {
      $('.input.zindex3').css('z-index','3');
      $('.input.zindex4').css('z-index','4');
      $('.input.zindex5').css('z-index','5');
    }
    $('body').toggleClass('disable-scroll');
  });

    //menu selection
  var selector1 = '.main-menu a';
  $(selector1).on('click', function() {            
    if(!$(this).parent().is(':last-child'))
        {
      $(selector1).removeClass('active');
      $(this).addClass('active');
    }
        
  });

    //responsive-menu selection
  var selector = '.submenu-responsive a';
  $(selector).on('click', function() {
    $(selector).removeClass('active');
    $(this).addClass('active');
    $('ul.submenu-responsive').toggleClass('on');
    $('div.back-submenu-responsive').fadeToggle();
    $('body').removeClass('disable-scroll');
  });

  $('.sub-ayuda a').click(function(){
    $('#sub-ayuda').fadeToggle();
    $(selector1).removeClass('active');
    $('#show-sub-ayuda').toggleClass('active');
  });
}