/*
jQuery mouseyDialog Plugin
	* Version 1.0
	* 2009-03-22 19:30:05
	* URL: http://github.com/mdbiscan/mouseyDialog
	* Description: jQuery mouseyDialog Plugin makes dialogs easy
	* Author: M.Biscan
	* Copyright: Copyright (c) 2010 M.Biscan
	* Licence: dual, MIT/GPLv2
	* requires jQuery1.4.2 and jQueryUI 1.8
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