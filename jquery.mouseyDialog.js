(function($){
  $.fn.mouseyDialog = function(options) { 
    var settings = $.extend({}, $.fn.mouseyDialog.defaults, options); 
    
    return this.each(function() {
      $anchor = $(this);
      $dialog = $($anchor.attr('href'));
      $closeButton = $('<a href="#" class="mouseyDialog_close">close</a>');
      $zIndex = settings.zIndex;
      $addOffset = settings.addOffset;
      $animation = settings.animation;
      $animationSpeed = settings.animationSpeed;
      $draggable = settings.draggable;

      setup();
      bindEvents();
    });
  };
  
  // Private functions
  function setup() {
    $closeButton
      .appendTo($dialog);
      
    $dialog
      .hide()
      .css({position:'absolute', zIndex:$zIndex})
      .addClass('mouseyDialog')
      .appendTo('body');
      
    if($draggable) {
      $dialog.draggable();
    }
  };
  
  function bindEvents() {
    // Custom event
    $anchor.bind('toggleDialog', function(event, x, y) {
      if($dialog.hasClass('visible')) {
        closeDialog($dialog);
      } else {
        openDialog($dialog, x, y);
      }
    });

    // Events
    $anchor.click(function(mouse) {
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      
      var dialogWidth = $dialog.innerWidth();
      var dialogHeight = $dialog.height() + $dialog.innerHeight();
      
      var browserHeight = mouse.screenY;
      var browserWidth = mouse.screenX;
      
      var browserX = browserWidth+dialogWidth;
      var browserY = browserHeight+dialogHeight;
      
      if(browserX >= windowWidth) {
        var x = mouse.pageX-$addOffset-(dialogWidth);
      } else {
        var x = mouse.pageX+$addOffset;
      }
      if(browserY >= windowHeight) {
        var y = mouse.pageY-$addOffset-(dialogHeight);
      } else {
        var y = mouse.pageY+$addOffset;
      }
      $(this).trigger('toggleDialog', [x, y]);

      var openDialog = $('.mouseyDialog.visible');
      if(openDialog.length == 1 && openDialog != $dialog) {
        closeDialog(openDialog);
      }
      return false;
    });
    
    $closeButton.click(function() {
      $anchor.trigger('toggleDialog');
      return false; 
    });

    // Prevents the dialog from being closed when clicking inside it
    $dialog.click(function(event) {
      event.stopPropagation();
    });
    // Closes the dialog when clicking outside of it
    $(document).click(function(event) {
      if(event.target != this) {
        if($dialog.hasClass('visible')) {
          closeDialog($dialog);
        }
      } 
    });
  };
  
  function openDialog(dialog, x, y) {
    var animation = ($animation == 'slide' ? 'slideDown' : 'fadeIn');

    $(dialog).css({top:y, left:x})[animation]($animationSpeed, function() {
      $(this).addClass('visible');
    });
  };
  
  function closeDialog(dialog) {
    var animation = ($animation == 'slide' ? 'slideUp' : 'fadeOut');

    $(dialog)[animation]($animationSpeed, function() {
      $(this).removeClass('visible');
    });
  };
  
  // Default values
  $.fn.mouseyDialog.defaults = {
    zIndex:100,
    addOffset:10,
    animation:'fade',
    animationSpeed:250,
    draggable:false
  };
})(jQuery);