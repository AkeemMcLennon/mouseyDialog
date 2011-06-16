/*
jQuery mouseyDialog Plugin
  * Version 1.0
  * 04-30-2010
  * URL: http://github.com/mdbiscan/mouseyDialog
  * Author: M.Biscan
  * requires jQuery1.4.2
  
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
  
    return this.each(function(index) { 
      var $anchor = $(this),
          $dialog = (settings.target == 'href') ? getID() : $(settings.target),
          $closeButton = $('<a>').attr('href','#').addClass('mouseyDialog_close').text(settings.closeText);
      
      ///////////
      // Setup //
      ///////////
      $dialog
        .hide()
        .css({position:'absolute', zIndex:settings.zIndex})
        .addClass(settings.customClass)
        .appendTo('body');
      
      ////////////
      // Events //
      ////////////
      // Custom event
      $anchor.bind('toggleDialog', function(event, x, y) {
        var timeout = 0;
        if(settings.eventType == 'hover') {
          timeout = 250;
        }
        
        if($anchor.hasClass('mouseyOn')) {
          closeDialog($anchor, $dialog);
        } else {
          setTimeout(function() {
            if($anchor.hasClass('hover')) {
              openDialog($anchor, $dialog, x, y);
            }
          }, timeout);
        }
      }).hover(
        function() {
          $(this).addClass('hover');
        }, 
        function() {
          $(this).removeClass('hover');
        }
      );
      
      var eventType = (settings.eventType == 'hover' ? 'mouseenter' : 'click');
      
      $anchor[eventType](function(event) {
            // Window
        var windowWidth = $(window).width(),
            windowHeight = $(window).height();
            // Screen
        var clientX = event.clientX, 
            clientY = event.clientY;
            // Dialog
        var dialogWidth = getDialogDimensions().width,
            dialogHeight = getDialogDimensions().height;
            // Mouse 
        var mouseX = event.pageX, 
            mouseY = event.pageY;
            // X, Y
        var x = mouseX+settings.addOffset,
            y = mouseY+settings.addOffset;
            
        if((dialogWidth + clientX) > windowWidth) {
          x = mouseX-settings.addOffset-((dialogWidth + clientX)-windowWidth);
        } 
        if((dialogHeight + clientY) > windowHeight) {
          y = mouseY-settings.addOffset-((dialogHeight + clientY)-windowHeight);
        }
      
        var openedDialog = $('.mouseyDialog.mouseyVisible'),
            onAnchor = $('a.mouseyOn');
            
        if(openedDialog.length == 1 && openedDialog != $dialog) {
          closeDialog(onAnchor, openedDialog);
        }
        
        $(this).trigger('toggleDialog', [x, y]);
        
        return false;
      });
      
      if(settings.eventType == 'hover') {
        if(settings.source == 'href'){
          $anchor.click(function() {
            return false;
          });
        }
        $anchor.mouseleave(function() {
          setTimeout(function() {
            if(!$dialog.hasClass('hover')) {
              $anchor.trigger('toggleDialog');
            }
          }, 150);
        });
        $dialog.hover(
          function() {
            $(this).addClass('hover');
          }, 
          function() {
            $(this).removeClass('hover');
            $anchor.trigger('toggleDialog');
          }
        );
      } else {
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
            if($dialog.hasClass('mouseyVisible')) {
              $anchor.trigger('toggleDialog');
            }
          } 
        });
      }
      
      ///////////////////////
      // Private functions //
      ///////////////////////
      function getID(url) {
        var id = $anchor.attr('href').split("#");       
        return $('#' + id[1]);
      };
      
      function getDialogDimensions() {
        $dialog.show();
        
        var height = $dialog.innerHeight(),
            width = $dialog.innerWidth();
        
        $dialog.hide();
        
        return {height:height, width:width};
      };
      
      function openDialog(anchor, dialog, x, y) {
        var animation = (settings.animation == 'slide' ? 'slideDown' : 'fadeIn');
        $(dialog).css({top:y, left:x})[animation](settings.animationSpeed, function() {
          $(this).addClass('mouseyVisible');
          $(anchor).addClass('mouseyOn');
        });
        if(settings.eventType == 'click') { $closeButton.appendTo($dialog); }   
        settings.openCallback.call();
      };

      function closeDialog(anchor, dialog) {
        var animation = (settings.animation == 'slide' ? 'slideUp' : 'fadeOut');
        $(dialog)[animation](settings.animationSpeed, function() {
          $(this).removeClass('mouseyVisible');
          $(anchor).removeClass('mouseyOn');
          settings.closeCallback.call(); 
        });
        if(settings.eventType == 'click') { $closeButton.detach(); } 
      };
    });
  };

  ////////////////////
  // Default optons //
  ////////////////////
  $.fn.mouseyDialog.defaults = {
    zIndex:100,
    eventType:'click',
    addOffset:10,
    animation:'fade',
    animationSpeed:250,
    customClass:'mouseyDialog',
    closeText:'close',
    target:'href',
    openCallback:function() {},
    closeCallback:function() {}
  };
})(jQuery);