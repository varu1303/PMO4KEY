$(document).ready(function() {

    $(document).on('click','#login-form-link',function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$('#login-form-link').addClass('active');
		e.preventDefault();
	});
    
	$(document).on('click','#register-form-link',function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$('#register-form-link').addClass('active');
		e.preventDefault();
	});
    
    $(document).on('click','.wrapToday',function(){
        $(".feedtoday").slideToggle();
    })
    $(document).on('click','.wrapYester',function(){
        $(".feedyester").slideToggle();
    })
    $(document).on('click','.wrapWeek',function(){
        $(".feedweek").slideToggle();
    })
    $(document).on('click','.wrapMonth',function(){
        $(".feedmonth").slideToggle();
    })

});