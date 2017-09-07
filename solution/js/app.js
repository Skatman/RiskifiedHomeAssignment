 (function(){
    'use strict';

  var apiKey = 'e238eb49738ff4c9b8abac9b526cba73',
    imagesPerPage = 24,
    term = '',
    imagesSearch = new FlickrImagesSearch(apiKey,imagesPerPage),
    displayedPages = 0;

  var $photosContainer = $('.photos-container'),
    $searchInput = $('form input[type="text"]'),
    $submitFormButton = $('form input[type="submit"]'),
    $searchForm = $('form'),
    $historyContainer = $('.history-container'),
    $historyTable = $('table'),
    $showMoreButton = $('button.show-more');

  $searchForm.submit(function(event){
    event.preventDefault();
    term = $searchInput.val();
    $photosContainer.html('');
    imagesSearch.getFlickrPhotos(term,1,disableSearch,enableSearch,displaySearchResults,displayError);
    displayedPages = 0;
  })

  function disableSearch(){
    $submitFormButton.attr('disabled','');
    $submitFormButton.val('Loading...');
  }

  function enableSearch(){
    $submitFormButton.removeAttr('disabled');
    $submitFormButton.val('Search');
  }

  function displaySearchResults(pagesNumber, resultsNumber, photos){

    var searchTime = new Date();
    displayPhotos(photos);
    addHistory(term, searchTime, resultsNumber, $historyTable);
    displayShowMoreButton(pagesNumber);
  }

  function displayPhotos(photos){
    if (!photos.length){
      $photosContainer.append('<div class="message">Nothing Is Found</div>');
      return;
    }
    photos.forEach(function(photo){
      var photoHTML = '<div class="photo-container"><a href="'+photo.largeURL+'" target="blank">'+
        '<img src="'+photo.smallURL+'" alt="'+photo.title+'" title="'+photo.title+'">'+
        '</a></div>';
      $photosContainer.append(photoHTML);
    })
    displayedPages++;
  }

  function addHistory(term, time, resultsNumber){
    $historyTable = $('table');
    if (!$historyTable.length){
      $historyContainer.html('');
      var historyContentHTML = '<table><tr><th>Search Term</th>'+
        '<th>Time Of Search</th><th>Number Of Search Results</th></tr></table>'+
        '<button class="alert">Clear Search History</button>';
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
        $submitFormButton.click();
      })
  }

  function displayShowMoreButton(pagesNumber){
    if (pagesNumber > displayedPages){
      $showMoreButton.css('display','block');
      $showMoreButton.unbind().click(function(){
        imagesSearch.getFlickrPhotos(term,displayedPages+1,disableShowMore,enableShowMore,displayNextPage,displayError)
    });
    } else {
      $showMoreButton.css('display','none');
    }
  }

  function disableShowMore(){
    $showMoreButton.attr('disabled','');
    $showMoreButton.html('Loading...');
  }

  function enableShowMore(){
    $showMoreButton.removeAttr('disabled');
    $showMoreButton.html('Show More');
  }

  function displayNextPage(pagesNumber, resultsNumber, photos){
      displayPhotos(photos);
      displayShowMoreButton(pagesNumber);
  }

  function displayError(errorText){
    throw errorText;
  }

 })();
