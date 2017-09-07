(function(window) {
  'use strict';

  function define_library() {
    function FlickrImagesSearch(apiKey, resultsPerPage) {
      this.apiKey = apiKey;
      this.resultsPerPage = resultsPerPage;

      var restURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
        format = 'json';

      this.getFlickrPhotos = function(term, pageNumber, beforeAction, afterAction, successCB, failCB) {
        var configObj = {
          url: restURL,
          data: {
            'api_key': this.apiKey,
            'format': format,
            'text': term,
            'nojsoncallback': 1,
            'per_page': this.resultsPerPage,
            'page': pageNumber
          }
        };

        beforeAction();

        $.ajax(configObj)
          .done(function(data) {
            afterAction();
            if (data.stat === 'ok') {
              var pagesNumber = data.photos.pages,
                photos = rawPhotosToPhotos(data.photos.photo);


              successCB(pagesNumber, data.photos.total, photos);
            } else {
              failCB(data.message);
            }
          })
          .fail(function(error) {
            afterAction();
            failCB('Please check your internet connection');
          });
      }

      function rawPhotosToPhotos(rawPhotos){
        var photos = [];
        rawPhotos.forEach(function(rawPhoto){
          var url = 'https://farm'+rawPhoto.farm+'.staticflickr.com/'+rawPhoto.server+'/'+rawPhoto.id+'_'+rawPhoto.secret,
            photo = {
              smallURL: url+'_q.jpg',
              largeURL: url+'_h.jpg',
              title: rawPhoto.title
            }
          photos.push(photo);
        })
        return photos;
      }

    }

    return FlickrImagesSearch;
  }

  if (typeof(FlickrImagesSearch) === 'undefined') {
    window.FlickrImagesSearch = define_library();
  } else {
    throw "FlickrImagesSearch already defined";
  }
})(window);
