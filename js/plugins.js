(function( $ ) {
  $.fn.rightClick = function(method) {

    $(this).on('contextmenu rightclick', function(e){
        e.preventDefault();
        method(this);
        return false;
    });

  };
})( jQuery );
