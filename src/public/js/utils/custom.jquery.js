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
        if (confirm('¿Seguro que deseas inscribirte a este curso?')) {
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
        let slider = new Slider('#'+idSlider, 5000);
        slider.play();
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