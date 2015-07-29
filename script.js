
(function () {

  'use strict';
  
  init();
  
  function DomObj() {
    var self = this;
    var productsLoaded, totalCount;
    self.products = [];

    /* ----- PUBLIC ----- */
    
    self.loadProducts = function (url) {
      productsLoaded = 0;
      $.getJSON(url, function (response) {
        totalCount = response.sales.length;
        for (var i = 0; i < totalCount; i++) {
          var product = new ProductObj(response.sales[i], i);
          self.products.push(product);
          product.updateHtml(asyncUpdateDom);
        }
      });
    }

    /* ----- PRIVATE ----- */
    
    function updateDom() {
      var i = 0;
      var thishtml = '';
      for (var i = 0; i < self.products.length; i++) {
        if (i % 3 === 0) {  
          console.log('START'); 
        }
        thishtml += self.products[i].htmlview;
        if ((i % 3 === 2) || i === (self.products.length - 1) ) { 
          console.log('FINISH'); 
        }
      }
      $('#content').append(thishtml);
      addEventListeners();
      
      //NOTE: setTimeout here to at least show half of loading rotation
      setTimeout(removeLoadingOverlay, 1000);
    }
    
    // This function is used as a callback for the ProductObj.updateHtml() function
    // It will keep track of how many products have finished loading,
    // and call updateDom() once everything is loaded
    function asyncUpdateDom() {
      productsLoaded++;
      if (productsLoaded === totalCount) {
        updateDom(); 
      }
    }
    
    function addEventListeners() {
      //Remove product listener with "fade" effect
      $('button.remove-btn').click(function() {
        var wrapperEl = $(this).closest('.product-wrapper');
        wrapperEl.addClass('fade-out');
        setTimeout(function () {
          wrapperEl.remove();
        }, 250);  //using setTimeout for smooth animation
      });
    }
    
    function removeLoadingOverlay() {
      var overlayEl = $('.is-loading');
      overlayEl.addClass('slide-up fade-out');
      setTimeout(function () {
        overlayEl.remove();
      }, 500);  //using setTimeout for smooth animation
    }
  }

  function ProductObj(product, i) {
    var self = this;
    self.photo = product.photos.medium_half;
    self.title = product.name;
    self.tagline = product.tagline;
    self.url = product.url;
    self.description = product.description;
    self.htmlview = '';
    self.index = i;
    self.custom_class = '';

    self.updateHtml = function (callback) {
      $.get('product-template.html', function (template) {
        self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{custom_class}', self.custom_class).replace('{description}', self.description);
      
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    }
  }

  function init() {
    var page = new DomObj();
    page.loadProducts('data.json');    
  }
  
}());