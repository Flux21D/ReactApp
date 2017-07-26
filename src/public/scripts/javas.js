$(function(){

	//demo links
	
  $('a[href="#"]').click(function(){
    return false;
  });

	//sliders

  $("div.slider-header").each(function(i) {
    idSlider = $(this).attr('id');
    slider = new Slider('#'+idSlider, 5000);
    slider.play();
  });

	//cookies notice self close
	
  $('#cookies').click(function(){
    $(this).hide();
  });

	//modal windows

  $('#register').click(function(){
    $('#modal-register').fadeIn();
    $('body').addClass('modal-on');
  });
  $('#forget').click(function(){
    $('#modal-forget').fadeIn();
    $('body').addClass('modal-on');
  });
  $('.close_window').click(function(){
    $('.modal-wrapper').fadeOut();
    $('body').removeClass('modal-on');
  });
  $(document).keyup(function(e) {
		  if (e.keyCode === 27) $('.modal-wrapper').fadeOut();
  });

	//submenu

  $('#show-sub-ayuda').click(function(){
    $('#sub-ayuda').fadeToggle();
    return false;
  });

	//responsive-menu

  $('#responsive-menu-toggler, .responsive-menu-toggler, div.back-submenu-responsive').click(function(){
    $('div.submenu-responsive').toggleClass('on');
    $('div.back-submenu-responsive').fadeToggle();
  });

	//select std-form

  $('div.std-form input.select').click(function(){
    $('div.select-values').hide();
    $(this).parent().find('div.select-values').show();
    $(this).blur();
  });

  $('div.std-form div.select-values div').click(function(){
    $(this).parent().parent().find('input.select').val($(this).html());
    $('div.select-values').hide();
  });

  $(document).mouseup(function (e)
		{
		    var container = $('div.select-values, #sub-ayuda');

		    if (!container.is(e.target)
		        && container.has(e.target).length === 0)
		    {
		        container.hide();
		    }
  });

	//modal external link confirmation

  $('.external_link').click(function(){
    $('#modal-external').fadeIn();
    link = $(this).attr('title');
    $('#modal-external #link-ok').attr('href', link);
  });

	//perfil-canjear thanks window

  $('div.canje div.icon').click(function(){
    if(confirm('¿Seguro que quieres canjear tus puntos por este regalo?')) {
      $('#modal-thanks').fadeIn();
    }
  });

	//course-register ok window

  $('a.inscribirse').click(function(){
    if(confirm('¿Seguro que deseas inscribirte a este curso?')) {
      $('#modal-ok').fadeIn();
    }
  });

});