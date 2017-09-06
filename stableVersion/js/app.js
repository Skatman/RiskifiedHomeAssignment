// (function(){
    'use strict';

    //AJAX request configuration object parameters definition
    var apiKey = 'e238eb49738ff4c9b8abac9b526cba73',
    restURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
    format = 'json',
    term,
    perPage = '24',
    pagesNumber,
    displayedPages = 0,
    showMoreDisplayed = false,
    addHistory = true;

    function getFlickrPhotos(term, pageNumber){
      $.ajax({
        url: restURL,
        data: {
          'api_key': apiKey,
          'format': format,
          'text': term,
          'nojsoncallback': 1,
          'per_page': perPage,
          'page': pageNumber
        }
      })
      .done(function(data) {
        if (data.stat === 'ok'){
          console.log('Calling function to show received photo');
          console.log(data);
          pagesNumber = data.photos.pages;
          console.log('pages number:', pagesNumber);
          displayedPages++;
          console.log('displayed pages:', displayedPages);
          renderPhotos(data.photos.photo);
          if (addHistory){
              var time = new Date();
              addRowToHistoryTable(term, time, data.photos.total);
          }
          //console.log(data.photos.photo);
        } else {
          console.log('Calling function to show error');
          //console.log(data.message);
        }
      })
      .fail(function(error) {
        console.log('Calling function to show request fail error');
        console.log('Please check your internet connection');
      });
  }

  function renderPhotos(rawPhotos){
    var photos = photosToSrcURL(rawPhotos);

    console.log('Here are photos to be rendered by render photos method:');
    console.log(photos);

    photos.forEach(function(photo){
      var photoHTML = '<div class="photo-container"><img src="'+photo.smallURL+'"></div>';
      $('.photos-container').append(photoHTML);
    })

    if (displayedPages < pagesNumber && !showMoreDisplayed){
      var buttonHTML = '<button>Show more</button>';
      $('.main-container').append(buttonHTML);
      $('button').click(function(){
        console.log('show more button is clicked');
        getFlickrPhotos(term,displayedPages+1)
      })
      showMoreDisplayed = true;
    }

    if (displayedPages === pagesNumber){
      $('button').css('display','none');
    }
  }

  function addRowToHistoryTable(term, time, numberOfResults){
    console.log('Add row to history table invoked');
    console.log('term', term);
    console.log('time', time);
    console.log('numberOfResults', numberOfResults);

    if ($('table').css('display') === 'none'){
      $('table').css('display','table');
    }

    var tableRowHTML = '<tr><td>'+term+'</td><td>'+time.toLocaleString()+'</td><td>'+numberOfResults+'</td></tr>';
    $('table').append(tableRowHTML);
    addHistory = false;
  }

  function photosToSrcURL(rawPhotos){
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

  $('form').submit(function(event){
    event.preventDefault();
    clearSearchResults();
    displayedPages = 0;
    addHistory = true;
    term = $('form input[type="text"]').val();
    getFlickrPhotos(term,displayedPages+1);
  })

  function clearSearchResults(){
    console.log('clear search results is called');
    $('.photos-container').html('');
  }
// })();
