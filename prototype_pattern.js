/*
jQuery simpleCarousel Plugin
  * Version 1.0
  * 04-30-2010
  * URL: http://github.com/mdbiscan/simpleCarousel
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
  jQuery.fn.mouseyDialog = function(options) {
    var settings = $.extend({}, { 
      zIndex:100,
      addOffset:10,
      animation:'fade',
      animationSpeed:250,
      draggable:false
    }, options);
    
    // Classic Class Structure (note: no var, it's exposed for TDD)
    MouseyDialog = function(anchor) {
      this.anchor = $(anchor);
      this.dialog = $(this.anchor.attr('href'));
      this.button = $('<a href="#" class="mouseyDialog_close">close</a>');
    };
    
    MouseyDialog.prototype = {          
      openDialog: function(dialog, x, y) {
        var animation = (settings.animation == 'slide' ? 'slideDown' : 'fadeIn');

        $(dialog).css({top:y, left:x})[animation](settings.animationSpeed, function() {
          $(this).addClass('visible');
        });
      },
      closeDialog: function(dialog) {
        var animation = (settings.animation == 'slide' ? 'slideUp' : 'fadeOut');

        $(dialog)[animation](settings.animationSpeed, function() {
          $(this).removeClass('visible');
        });
      },
      setup: function() {        
        this.button
          .appendTo(this.dialog);
          
        this.dialog
          .hide()
          .css({position:'absolute', zIndex:settings.zIndex})
          .addClass('mouseyDialog')
          .appendTo('body');
          
        if(settings.draggable) {
          this.dialog.draggable();
        }
      },
      bindEvents: function() {
        var that = this;
        
        // Custom event
        this.anchor.bind('toggleDialog', function(event, x, y) {
          if(that.dialog.hasClass('visible')) {
            that.closeDialog(that.dialog);
          } else {
            that.openDialog(that.dialog, x, y);
          }
        });

        // Events
        this.anchor.click(function(mouse) {
          var windowWidth = $(window).width();
          var windowHeight = $(window).height();
          
          var dialogWidth = that.dialog.innerWidth();
          var dialogHeight = that.dialog.height() + that.dialog.innerHeight();
          
          var browserHeight = mouse.screenY;
          var browserWidth = mouse.screenX;
          
          var browserX = browserWidth+dialogWidth;
          var browserY = browserHeight+dialogHeight;
          
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
          if(openDialog.length == 1 && openDialog != that.dialog) {
            that.closeDialog(openDialog);
          }
          return false;
        });
        
        this.button.click(function() {
          that.anchor.trigger('toggleDialog');
          return false; 
        });

        // Prevents the dialog from being closed when clicking inside it
        this.dialog.click(function(event) {
          event.stopPropagation();
        });
        // Closes the dialog when clicking outside of it
        $(document).click(function(event) {
          if(event.target != this) {
            if(that.dialog.hasClass('visible')) {
              that.closeDialog(that.dialog);
            }
          } 
        });
      }
    };

    // jQuery Distribution
    return this.each(function() {
      var mouseyDialog = new MouseyDialog(this);
      mouseyDialog.setup();
      mouseyDialog.bindEvents();
    });
  };
})(jQuery);