(function($){
  jQuery.fn.mouseyDialog = function() {
    return this.each(function() {
      var anchor = $(this);
      var dialog = $(anchor.attr('href'));
      var button = $('<a href="#" class="mouseyDialog_close">close</a>');
      
      setup();
      bindEvents();
      
      function openDialog(x, y) {
        dialog.css({top:y, left:x}).fadeIn(250, function() {
          dialog.addClass('visible');
        });
      };  
      
      function closeDialog() {
        dialog.fadeOut(250, function() {
          dialog.removeClass('visible');
        });
      };
    
      function setup() {
        button
          .appendTo(dialog);
          
        dialog
          .hide()
          .css({position:'absolute'})
          .addClass('mouseyDialog')
          .appendTo('body');
      }

      function bindEvents() {
        // Custom event
        anchor.bind('toggleDialog', function(event, x, y) {
          if(dialog.hasClass('visible')) {
            closeDialog();
          } else {
            openDialog(x, y);
          }
        });

        // Events
        anchor.click(function(mouse) {
          var x = mouse.pageX+10;
          var y = mouse.pageY+10;

          $(this).trigger('toggleDialog', [x, y]);
          return false;
        });
        button.click(function() {
          anchor.trigger('toggleDialog');
          return false; 
        });

        // Prevents the dialog from being closed when clicking inside it
        dialog.click(function(event) {
          event.stopPropagation();
        });
        // Closes the dialog when clicking outside of it
        $(document).click(function(event) {
          if(event.target != this) {
            if(dialog.hasClass('visible')) {
              closeDialog();
              event.preventDefault();
            }
          } 
        });
      };
    });
  };
})(jQuery);