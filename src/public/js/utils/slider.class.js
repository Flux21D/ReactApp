var timers=new Array(); //global array for timers

var Slider = function(idslider, interval) {

	//init
  var num_prev = 1;
  var num_next = 2;
  var timer;
  var paginator = $(idslider).has("div.paginator").length;
  var num = $(idslider+" div.slides").children().length;
  var _this = this;

  if(paginator) $(idslider+ ' div.paginator div:nth-child(1)').addClass('active');
  $(idslider+" div.slides div.slide:nth-child(1)").show();

	//start slider
  this.play = function() {
    timer = setTimeout(_this.nextSlide, interval);
    timers[idslider] = timer;
  }
	
	//stop slider
  this.stop = function() {
    clearTimeout(timers[idslider]);
  }
	
	//go to next slide
  this.nextSlide = function() {
		//calculate next
    num_next = num_prev+1;
    if (num_next==num+1) num_next = 1;
		//switch
    letsGo();
		//set timer
    timer = setTimeout(_this.nextSlide, interval);
    timers[idslider] = timer;
  }
	
	//go to previous slide
  this.previousSlide = function() {
		//calculate previous
    num_next = num_prev-1;
    if (num_next==0) num_next = num;
		//switch
    letsGo();
		//set timer
    timer = setTimeout(_this.nextSlide, interval);
    timers[idslider] = timer;
  }
	
	//go to slide number
  this.goToSlide = function(number) {
		//stop
    this.stop();
		//next is number
    num_next = number;
		//switch
    letsGo();
		//set timer
    timer = setTimeout(_this.nextSlide, interval);
    timers[idslider] = timer;
  }
	
	//switch slides
  var letsGo = function() {
		//switch
    $(idslider+" div.slides div.slide:nth-child("+num_prev+")").fadeOut(700);
    $(idslider+" div.slides div.slide:nth-child("+num_next+")").fadeIn(400);
		//paginator
    if(paginator) {
      $(idslider+ ' div.paginator div:nth-child('+num_prev+')').removeClass('active');
      $(idslider+ ' div.paginator div:nth-child('+num_next+')').addClass('active');
    }
		//set prev
    num_prev = num_next;
  }
	
}
