$('.ui.dropdown').dropdown();
$("#comment").click(function(){
  $(".comments").slideToggle();
});
$("#icon").click(function(){
  $(".ui.fixed.massive.stackable.menu").toggleClass("show");
  $("")
});
$("#commentOption").click(function(){
	$(".commentOptions").slideToggle();
});
$("#postOption").click(function(){
	$(".postOptions").slideToggle();
});
ClassicEditor
            .create( document.querySelector( '#editor' ) )
            .catch( error => {
                console.error( error );
            } );
