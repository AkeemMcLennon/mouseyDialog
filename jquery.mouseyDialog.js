/*
jQuery mouseyDialog Plugin
  * Version 1.0
  * 04-30-2010
  * URL: http://github.com/mdbiscan/mouseyDialog
  * Author: M.Biscan
  * requires jQuery1.4.2 & jQueryUI 1.8 (for draggable())
  
  Copyright (c) 2010 M.Biscan

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($){
  $.fn.mouseyDialog = function(options) { 
    var settings = $.extend({}, $.fn.mouseyDialog.defaults, options); 
    
    return this.each(function() {
      var $anchor = $(this),
          $dialog = $($anchor.attr('href')),
          $closeButton = $('<a href="#" class="mouseyDialog_close">close</a>');

     ///////////
     // Setup //
     ///////////
     $closeButton
        .appendTo($dialog);

      $dialog
        .hide()
        .css({position:'absolute', zIndex:settings.zIndex})
        .addClass('mouseyDialog')
        .appendTo('body');

      if(settings.draggable) {
        $dialog.draggable();
      }
      
      ////////////
      // Events //
      ////////////
      // Custom event
      $anchor.bind('toggleDialog', function(event, x, y) {
        if($dialog.hasClass('visible')) {
          closeDialog($dialog);
        } else {
          openDialog($dialog, x, y);
        }
      });
      
      $anchor.click(function(mouse) {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height();

        var dialogWidth = $dialog.innerWidth(),
            dialogHeight = $dialog.height() + $dialog.innerHeight();

        var browserHeight = mouse.screenY,
            browserWidth = mouse.screenX;

        var browserX = browserWidth+dialogWidth,
            browserY = browserHeight+dialogHeight;

        if(browserX >= windowWidth) {
          var x = mouse.pageX-settings.addOffset-(dialogWidth);
        } else {
          var x = mouse.pageX+settings.addOffset;
        }
        if(browserY >= windowHeight) {
          var y = mouse.pageY-settings.addOffset-(dialogHeight);
        } else {
          var y = mouse.pageY+settings.addOffset;
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
    });
    
    ///////////////////////
    // Private functions //
    ///////////////////////
    function openDialog(dialog, x, y) {
      var animation = (settings.animation == 'slide' ? 'slideDown' : 'fadeIn');

      $(dialog).css({top:y, left:x})[animation](settings.animationSpeed, function() {
        $(this).addClass('visible');
      });
    };

    function closeDialog(dialog) {
      var animation = (settings.animation == 'slide' ? 'slideUp' : 'fadeOut');

      $(dialog)[animation](settings.animationSpeed, function() {
        $(this).removeClass('visible');
      });
    };
  };

  ////////////////////
  // Default optons //
  ////////////////////
  $.fn.mouseyDialog.defaults = {
    zIndex:100,
    addOffset:10,
    animation:'fade',
    animationSpeed:250,
    draggable:false
  };
})(jQuery);