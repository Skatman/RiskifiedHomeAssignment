 (function(){
    'use strict';

  var apiKey = 'e238eb49738ff4c9b8abac9b526cba73',
    imagesPerPage = 24,
    term;

  var imagesSearch = new FlickrImagesSearch(apiKey,imagesPerPage),
    $photosContainer = $('.photos-container'),
    $searchInput = $('form input[type="text"]'),
    $submitFormButton = $('form input[type="submit"]'),
    $searchForm = $('form'),
    $historyContainer = $('.history-container'),
    $historyTable = $('table');

  $searchForm.submit(function(event){
    event.preventDefault();
    term = $searchInput.val();
    $photosContainer.html('');
    imagesSearch.getFlickrPhotos(term,1,disableSearch,enableSearch,displaySearchResults,displayError);
  })

  function disableSearch(){
    $submitFormButton.attr('disabled','');
    $submitFormButton.val('Loading...');
    $historyTable.attr('disabled','');
  }

  function enableSearch(){
    $submitFormButton.removeAttr('disabled');
    $submitFormButton.val('Search');
    $historyTable.removeAttr('disabled');
  }

  function displaySearchResults(pagesNumber, resultsNumber, photos){

    var searchTime = new Date();
    displayPhotos(pagesNumber, photos);
    addHistory(term, searchTime, resultsNumber, $historyTable);

  }

  function displayPhotos(pagesNumber, photos){
    if (!photos.length){
      $photosContainer.append('<div class="message">Nothing Is Found</div>');
    }
    photos.forEach(function(photo){
      var photoHTML = '<div class="photo-container"><img src="'+photo.smallURL+'"></div>';
      $photosContainer.append(photoHTML);
    })
  }

  function addHistory(term, time, resultsNumber){
    $historyTable = $('table');
    if (!$historyTable.length){
      $historyContainer.html('');
      var historyContentHTML = '<table><tr><th>Search Term</th>'+
        '<th>Time Of Search</th><th>Number Of Search Results</th></tr></table>'+
        '<button>Clear Search History</button>';
      $historyContainer.html(historyContentHTML);
      $historyContainer.find('button').click(function(){
        $historyContainer.html('');
        $historyContainer.html('<div class="message">Search History Is Empty</div>');
      });
      $historyTable = $('table');
    }

    var newRowHTML = '<tr><td>'+term+'</td><td>'+time.toLocaleString()+'</td><td>'+resultsNumber+'</td></tr>';
    $historyTable.append(newRowHTML);

    $historyTable.find('tr:last').click(function() {
        $searchInput.val(term);
        $searchForm.submit();
      })
  }

  function displayError(errorText){
    throw errorText;
  }

 })();
